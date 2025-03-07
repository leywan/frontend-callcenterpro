import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Plus, Search, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ImportExportClients } from '@/components/clients/ImportExportClients';

interface FinalClient {
  id: string;
  name: string;
  address: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: 'actif' | 'résilié';
  parent_client: {
    id: string;
    name: string;
  };
}

export function FinalClientsPage() {
  const [clients, setClients] = useState<FinalClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchFinalClients();
  }, []);

  async function fetchFinalClients() {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        parent_client:parent_client_id (
          id,
          name
        )
      `)
      .eq('type', 'final')
      .order('name');

    if (error) {
      console.error('Error fetching final clients:', error);
      return;
    }

    setClients(data);
    setLoading(false);
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.parent_client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">Chargement des clients finaux...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients finaux</h1>
          <p className="text-gray-600">Gestion des sites clients</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un client..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ImportExportClients onImportSuccess={fetchFinalClients} />

          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau client
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
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.status === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {client.status === 'actif' ? 'Actif' : 'Résilié'}
                  </span>
                </div>
              </div>
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

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-900">Contact principal</p>
              <p className="text-sm text-gray-600">{client.contact_name}</p>
            </div>

            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={() => navigate(`/clients/final/${client.id}`)}
              >
                Voir détails
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}