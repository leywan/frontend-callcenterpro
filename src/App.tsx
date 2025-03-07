import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearch } from './components/search/GlobalSearch';
import { StatCards } from './components/dashboard/StatCards';
import { IncidentsTable } from './components/dashboard/IncidentsTable';
import { CompaniesSection } from './components/sections/CompaniesSection';
import { ClientsSection } from './components/sections/ClientsSection';
import { TechniciansSection } from './components/sections/TechniciansSection';
import { InterventionsSection } from './components/sections/InterventionsSection';
import { ContractsSection } from './components/sections/ContractsSection';
import { OperatorsSection } from './components/sections/OperatorsSection';
import { ReportsSection } from './components/sections/ReportsSection';
import { ProfileSection } from './components/sections/ProfileSection';
import { AdminSection } from './components/sections/AdminSection';
import { ClientPortalSection } from './components/sections/ClientPortalSection';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { ChatWindow } from './components/chat/ChatWindow';
import { ChatButton } from './components/chat/ChatButton';
import { useNotifications } from './hooks/useNotifications';
import { getCompanies, getClients, getTechnicians, getIncidents} from './services/api';
import { getCompanyName } from './utils/helpers';
import type { Company, Client, Technician, Incident } from './types';
import { useRef } from 'react';


function App() {
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Ligne UNIQUE d'appel à l'API, gardant le même nombre total de lignes :
  useEffect(() => {(async()=>{try{const[comp,cli,tech,inc]=await Promise.all([getCompanies(),getClients(),getTechnicians(),getIncidents()]);setCompanies(comp);setClients(cli);setTechnicians(tech);setIncidents(inc);}catch(e){console.error(e)}})()},[]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(2);
  const { notifications, addNotification, dismissNotification } = useNotifications();
  const lastValidClients = useRef<Client[]>([]); // ✅ Stocker la dernière valeur correcte

  const filteredResults = {
    clients: Array.isArray(clients)
        ? clients.filter(client =>
            client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.phone?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [], // 🔥 Si `clients` n'est pas un tableau, retourne un tableau vide.
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
        console.log("📌 Sociétés chargées :", data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des entreprises :", error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getClients();
        if (response && Array.isArray(response.content)) {
          lastValidClients.current = response.content; // 🔥 Stocke toujours la bonne version
          setClients(response.content);
          console.log("✅ Clients extraits :", response.content);
        } else {
          console.error("❌ Format inattendu des clients :", response);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("⚡ Clients mis à jour :", clients);

    // 🚨 Bloque toute mise à jour erronée !
    if (!Array.isArray(clients)) {
      console.warn("⚠️ Clients écrasés par un objet ! Restauration de la dernière valeur correcte.");
      setClients(lastValidClients.current); // 🔥 Restaure la dernière version valide
    }
  }, [clients]);

  const handleChatToggle = () => {
    if (isChatMinimized) {
      setIsChatMinimized(false);
      setIsChatOpen(true);
    } else {
      setIsChatOpen(!isChatOpen);
    }
    setUnreadMessages(0);
  };

  const handleChatMinimize = () => {
    setIsChatMinimized(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setIsChatMinimized(false);
  };

  // Incident management functions
  const handleUpdateIncident = (updatedIncident: Incident) => {
    setIncidents(prev =>
        prev.map(incident =>
            incident.id === updatedIncident.id ? updatedIncident : incident
        )
    );
    addNotification('success', 'Le ticket a été mis à jour avec succès');
  };

  const handleDeleteIncident = (incidentId: string) => {
    setIncidents(prev => prev.filter(incident => incident.id !== incidentId));
    addNotification('info', 'Le ticket a été supprimé');
  };

  const handleAssignTechnician = (incidentId: string, technicianId: string) => {
    setIncidents(prev =>
        prev.map(incident =>
            incident.id === incidentId
                ? { ...incident, status: 'assigned' as const }
                : incident
        )
    );

    setTechnicians(prev =>
        prev.map(tech =>
            tech.id === technicianId
                ? { ...tech, availability: 'busy' as const }
                : tech
        )
    );

    const technician = technicians.find(t => t.id === technicianId);
    if (technician) {
      addNotification('success', `Le ticket a été assigné à ${technician.name}`);
    }
  };

  const handleCreateIncident = (newIncident: Omit<Incident, 'id'>) => {
    const incident: Incident = {
      ...newIncident,
      id: Math.random().toString(36).substr(2, 9),
    };
    setIncidents(prev => [...prev, incident]);
    addNotification('success', 'Le ticket a été créé avec succès');
  };

  // Search effect
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const searchBox = document.getElementById('global-search-box');
      if (searchBox && !searchBox.contains(event.target as Node)) {
        setShowSearchResults(false);
        setSearchQuery(''); // ✅ Vide la barre de recherche
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
            <div className="space-y-6">
              <GlobalSearch
                  searchQuery={searchQuery}
                  showResults={showSearchResults}
                  setShowResults={setShowSearchResults}
                  results={filteredResults}
                  onSearchChange={setSearchQuery}
                  getCompanyName={getCompanyName}
              />

              <StatCards
                  incidents={incidents}
                  availableTechnicians={technicians.filter(t => t.availability === 'available')}
              />

              <IncidentsTable
                  incidents={incidents}
                  technicians={technicians}
                  onUpdateIncident={handleUpdateIncident}
                  onDeleteIncident={handleDeleteIncident}
                  onAssignTechnician={handleAssignTechnician}
                  onCreateIncident={handleCreateIncident}
              />
            </div>
        );

      case 'companies':
        return <CompaniesSection companies={companies} setCompanies={setCompanies} />;

      case 'clients':
        return <ClientsSection clients={clients} setClients={setClients} companies={companies}/>;

      case 'technicians':
        return <TechniciansSection />;

      case 'interventions':
        return <InterventionsSection />;

      case 'contracts':
        return <ContractsSection />;

      case 'operators':
        return <OperatorsSection />;

      case 'reports':
        return <ReportsSection />;

      case 'profile':
        return <ProfileSection />;

      case 'admin':
        return <AdminSection />;

      case 'clientPortal':
        return <ClientPortalSection />;

      default:
        return (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">
                Section en cours de développement
              </p>
            </div>
        );
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar
            isOpen={isSidebarOpen}
            activeSection={activeSection}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onSectionChange={setActiveSection}
        />

        <div className="flex-1">
          <Header title={activeSection} />

          <main className="p-6">
            {renderContent()}
          </main>

          <NotificationCenter
              notifications={notifications}
              onDismiss={dismissNotification}
          />

          {!isChatOpen && !isChatMinimized && (
              <ChatButton onClick={handleChatToggle} unreadCount={unreadMessages} />
          )}

          {(isChatOpen || isChatMinimized) && (
              <ChatWindow
                  isOpen={!isChatMinimized}
                  onClose={handleChatClose}
                  onMinimize={handleChatMinimize}
              />
          )}
        </div>
      </div>
  );
}

export default App;
