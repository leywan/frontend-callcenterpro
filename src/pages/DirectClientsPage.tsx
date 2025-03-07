import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, Plus, Search, Users, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { AddManagerForm } from '@/components/forms/AddManagerForm';
import { EditClientForm } from '@/components/forms/EditClientForm';
import { CreateCompanyForm } from '@/components/forms/CreateCompanyForm';
import { LocationMap } from '@/components/maps/LocationMap';
import { DeleteConfirmationDialog } from '@/components/dialogs/DeleteConfirmationDialog';

interface CompanyManager {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string | null;
  is_primary: boolean;
}

interface DirectClient {
  id: string;
  name: string;
  address: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  siret?: string;
  company_type?: string;
  service_zone?: string;
  managers?: CompanyManager[];
  statistics?: {
    total_sites: number;
    active_sites: number;
    terminated_sites: number;
  };
}

export function DirectClientsPage() {
  const [clients, setClients] = useState<DirectClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClient, setEditingClient] = useState<DirectClient | null>(null);
  const [addingManagerForClient, setAddingManagerForClient] = useState<string | null>(null);
  const [deletingClient, setDeletingClient] = useState<DirectClient | null>(null);

  useEffect(() => {
    fetchDirectClients();
  }, []);

  async function fetchDirectClients() {
    // Récupérer les clients directs avec leurs statistiques
    const { data: clientsData, error: clientsError } = await supabase
      .from('client_statistics')
      .select('*');

    if (clientsError) {
      console.error('Error fetching client statistics:', clientsError);
      return;
    }

    // Récupérer les détails des clients
    const { data: clientDetails, error: detailsError } = await supabase
      .from('clients')
      .select('*')
      .eq('type', 'direct');

    if (detailsError) {
      console.error('Error fetching client details:', detailsError);
      return;
    }

    // Fusionner les données
    const clientsWithStats = clientDetails.map(client => {
      const stats = clientsData.find(stat => stat.company_id === client.id);
      return {
        ...client,
        statistics: stats ? {
          total_sites: stats.total_sites,
          active_sites: stats.active_sites,
          terminated_sites: stats.terminated_sites
        } : {
          total_sites: 0,
          active_sites: 0,
          terminated_sites: 0
        }
      };
    });

    // Pour chaque client, récupérer ses responsables
    const clientsWithManagers = await Promise.all(
      clientsWithStats.map(async (client) => {
        const { data: managersData, error: managersError } = await supabase
          .from('company_managers')
          .select('*')
          .eq('client_id', client.id)
          .order('is_primary', { ascending: false });

        if (managersError) {
          console.error('Error fetching managers:', managersError);
          return client;
        }

        return {
          ...client,
          managers: managersData
        };
      })
    );

    setClients(clientsWithManagers);
    setLoading(false);
  }

  const handleDeleteClient = async (client: DirectClient) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', client.id);

    if (error) {
      console.error('Error deleting company:', error);
      return;
    }

    setDeletingClient(null);
    fetchDirectClients();
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">Chargement des sociétés de maintenance...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sociétés de maintenance</h1>
          <p className="text-gray-600">Gestion des sociétés de maintenance partenaires</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une société..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="flex items-center"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle société
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                </div>
                {client.siret && (
                  <p className="text-sm text-gray-500 mt-1">SIRET: {client.siret}</p>
                )}
              </div>
              {client.statistics && (
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {client.statistics.active_sites} sites actifs
                  {client.statistics.terminated_sites > 0 && ` (${client.statistics.terminated_sites} résiliés)`}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-gray-600">{client.address}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{client.contact_phone}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{client.contact_email}</span>
              </div>
            </div>

            <div className="mt-4">
              <LocationMap address={client.address} name={client.name} />
            </div>

            {client.service_zone && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-900">Zone de service</p>
                <p className="text-sm text-gray-600">{client.service_zone}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Responsables ({client.managers?.length || 0})
                  </span>
                </div>
                {expandedClient === client.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {expandedClient === client.id && client.managers && (
                <div className="mt-2 space-y-3">
                  {client.managers.map((manager) => (
                    <div key={manager.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{manager.name}</p>
                          <p className="text-sm text-gray-500">{manager.position}</p>
                        </div>
                        {manager.is_primary && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>{manager.email}</p>
                        {manager.phone && <p>{manager.phone}</p>}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setAddingManagerForClient(client.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un responsable
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={() => setEditingClient(client)}
              >
                Modifier
              </Button>
              <Button 
                variant="outline" 
                className="text-sm text-red-600 hover:text-red-700"
                onClick={() => setDeletingClient(client)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <CreateCompanyForm 
          onClose={() => setShowCreateForm(false)}
          onSuccess={fetchDirectClients}
        />
      )}

      {editingClient && (
        <EditClientForm
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSuccess={fetchDirectClients}
        />
      )}

      {addingManagerForClient && (
        <AddManagerForm
          clientId={addingManagerForClient}
          onClose={() => setAddingManagerForClient(null)}
          onSuccess={fetchDirectClients}
        />
      )}

      {deletingClient && (
        <DeleteConfirmationDialog
          title="Supprimer la société"
          message={`Êtes-vous sûr de vouloir supprimer la société "${deletingClient.name}" ? Cette action est irréversible.`}
          onConfirm={() => handleDeleteClient(deletingClient)}
          onCancel={() => setDeletingClient(null)}
        />
      )}
    </div>
  );
}