import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { LocationMap } from '@/components/maps/LocationMap';

interface FinalClient {
  id: string;
  name: string;
  address: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: 'actif' | 'résilié';
  contract_start_date: string | null;
  contract_end_date: string | null;
  contract_renewal_date: string | null;
  termination_date: string | null;
  termination_reason: string | null;
  parent_client: {
    id: string;
    name: string;
  };
}

export function FinalClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<FinalClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTerminationForm, setShowTerminationForm] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');

  useEffect(() => {
    fetchClient();
  }, [id]);

  async function fetchClient() {
    if (!id) return;

    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        parent_client:parent_client_id (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      return;
    }

    setClient(data);
    setLoading(false);
  }

  const handleTerminate = async () => {
    if (!client || !terminationReason) return;

    const { error } = await supabase
      .from('clients')
      .update({
        status: 'résilié',
        termination_date: new Date().toISOString(),
        termination_reason: terminationReason
      })
      .eq('id', client.id);

    if (error) {
      console.error('Error terminating client:', error);
      return;
    }

    setShowTerminationForm(false);
    fetchClient();
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600 dark:text-gray-400">Chargement...</div>;
  }

  if (!client) {
    return <div className="p-8 text-center text-gray-600 dark:text-gray-400">Client non trouvé</div>;
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
      >
        ← Retour
      </button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Géré par {client.parent_client?.name}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {client.status === 'actif' ? (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                    Actif
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-medium">
                    Résilié
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Adresse</h3>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                  <span className="text-gray-900 dark:text-white">{client.address}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{client.contact_phone}</span>
                  </div>
                  {client.contact_email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-900 dark:text-white">{client.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <LocationMap address={client.address} name={client.name} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contrat de maintenance</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {client.contract_start_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Date de début
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-900 dark:text-white">
                      {format(new Date(client.contract_start_date), 'd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
              )}

              {client.contract_end_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Date de fin
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-900 dark:text-white">
                      {format(new Date(client.contract_end_date), 'd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
              )}

              {client.contract_renewal_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Date de renouvellement
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-900 dark:text-white">
                      {format(new Date(client.contract_renewal_date), 'd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {client.status === 'résilié' && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200">Contrat résilié</h4>
                    {client.termination_date && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Résilié le {format(new Date(client.termination_date), 'd MMMM yyyy', { locale: fr })}
                      </p>
                    )}
                    {client.termination_reason && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Motif : {client.termination_reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              {client.status === 'actif' ? (
                <Button 
                  variant="outline"
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  onClick={() => setShowTerminationForm(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Résilier le contrat
                </Button>
              ) : (
                <Button 
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  onClick={async () => {
                    const { error } = await supabase
                      .from('clients')
                      .update({
                        status: 'actif',
                        termination_date: null,
                        termination_reason: null
                      })
                      .eq('id', client.id);

                    if (error) {
                      console.error('Error reactivating client:', error);
                      return;
                    }

                    fetchClient();
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Réactiver le contrat
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sections supplémentaires à ajouter ici */}
        </div>
      </div>

      {showTerminationForm && (
        <>
          <div className="modal-backdrop" />
          <div className="modal-container">
            <div className="modal-content max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Résilier le contrat</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Motif de résiliation
                    </label>
                    <textarea
                      value={terminationReason}
                      onChange={(e) => setTerminationReason(e.target.value)}
                      className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTerminationForm(false)}
                    >
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleTerminate}
                      className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600"
                      disabled={!terminationReason}
                    >
                      Confirmer la résiliation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}