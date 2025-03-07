import React from 'react';
import { 
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  Headphones,
  FileText,
  Phone,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Calendar,
  Settings,
  UserCircle,
  Contact as FileContract,
  Map,
  LayoutDashboardIcon
} from 'lucide-react';
import { operators } from '../../data/mockData';

const currentUser = operators.find(op => op.id === '1')!;

const navItems = [
  { key: 'dashboard', name: 'Tableau de bord', icon: <LayoutDashboard size={24} /> },
  { key: 'companies', name: 'Permanences', icon: <Building2 size={24} /> },
  { key: 'clients', name: 'Clients', icon: <Users size={24} /> },
  { key: 'technicians', name: 'Techniciens', icon: <UserCog size={24} /> },
  { key: 'interventions', name: 'Interventions', icon: <Map size={24} /> },
  { key: 'contracts', name: 'Contrats', icon: <FileContract size={24} /> },
  { key: 'operators', name: 'Opérateurs', icon: <Headphones size={24} /> },
  { key: 'reports', name: 'Rapports', icon: <FileText size={24} /> },
  { key: 'clientPortal', name: 'Portail Client', icon: <LayoutDashboardIcon size={24} /> },
];

const adminItems = [
  { key: 'admin', name: 'Administration', icon: <Settings size={24} /> },
];

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onToggle: () => void;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeSection,
  onToggle,
  onSectionChange,
}) => {
  const handleLogout = () => {
    console.log('Déconnexion...');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div 
      className={`bg-gray-800 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } min-h-screen relative flex flex-col justify-between`}
    >
      <div>
        <button
          onClick={onToggle}
          className="absolute -right-3 top-9 bg-gray-800 rounded-full p-1 text-white"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <Phone className="h-8 w-8" />
            {isOpen && (
              <h1 className="text-xl font-bold">CallCenter Pro</h1>
            )}
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onSectionChange(item.key)}
                className={`sidebar-item ${activeSection === item.key ? 'active' : ''}`}
              >
                {item.icon}
                {isOpen && <span>{item.name}</span>}
              </button>
            ))}

            {isAdmin && (
              <>
                <div className="border-t border-gray-700 my-4"></div>
                {adminItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onSectionChange(item.key)}
                    className={`sidebar-item ${activeSection === item.key ? 'active' : ''}`}
                  >
                    {item.icon}
                    {isOpen && <span>{item.name}</span>}
                  </button>
                ))}
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSectionChange('profile')}
            className={`flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors w-full ${
              activeSection === 'profile' ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <UserCircle size={20} />
            {isOpen && <span>Mon profil</span>}
          </button>
          <div className="flex items-center gap-3 text-gray-400 px-3">
            <Calendar size={20} />
            {isOpen && (
              <div className="text-sm">
                <div>{new Date().toLocaleDateString('fr-FR')}</div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors w-full"
          >
            <LogOut size={20} />
            {isOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </div>
  );
};