import React, { useEffect, useState } from 'react';
import { Plus, Search, Globe } from 'lucide-react';
import {
  getClients,  // doit supporter (companyId, page, size) => { content: [...], totalElements: number }
  createClient,
  updateClient,
  deleteClient
} from '../../services/api';
import { FormModal } from '../modals/FormModal';
import { ClientForm } from '../forms/ClientForm';
import type { Client, Company } from '../../types';

interface ClientsSectionProps {
  companies?: Company[]; // Optionnel si tu veux un tableau local, sinon on utilise client.company directement
}

export const ClientsSection: React.FC<ClientsSectionProps> = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  console.log("📌 Clients dans ClientsSection :", clients);

  // Charger les clients à chaque changement de page
  useEffect(() => {
    fetchClients();
  }, [page]);

  async function fetchClients() {
    try {
      // Suppose qu'on ne passe pas de companyId => on récupère tous les clients
      // ou tu mets un ID si tu veux filtrer : ex: const companyId = 1;
      const data = await getClients(null, page, size);
      console.log("📌 Données API clients :", data);

      if (data && Array.isArray(data.content)) {
        setClients(data.content);
        if (data.totalElements) {
          setTotalPages(Math.ceil(data.totalElements / size));
        }
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des clients :", error);
    }
  }

  const handleAddClient = async (clientData: Partial<Client>) => {
    try {
      await createClient(clientData);
      setPage(0); // Recharger depuis la page 0
      setShowAddModal(false);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du client :", error);
    }
  };

  const handleEditClient = async (clientData: Partial<Client>) => {
    if (!editingClient) return;
    try {
      await updateClient(String(editingClient.id), clientData);
      setPage(0);
      setEditingClient(null);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du client :", error);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      setPage(0);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du client :", error);
    }
  };

  return (
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Clients</h2>
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Nouveau client
          </button>
        </div>

        {/* Barre de recherche (non fonctionnelle) */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
              type="text"
              placeholder="Rechercher un client..."
              className="search-field"
          />
        </div>

        {/* Liste des clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.length > 0 ? (
              clients.map(client => (
                  <div
                      key={client.id}
                      className="card hover:scale-[1.02] cursor-pointer"
                      onClick={() => setEditingClient(client)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {client.name || "Nom indisponible"}
                      </h3>
                      <span
                          className={`status-badge ${
                              client.status === "active"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          }`}
                      >
                  {client.status === "active" ? "Actif" : "Inactif"}
                </span>
                    </div>

                    <div className="space-y-2 text-gray-600 dark:text-gray-300">
                      <p>{client.address || "Adresse non renseignée"}</p>
                      <p>{client.phone || "Téléphone non renseigné"}</p>
                      <p className="text-sm">{client.email || "Email non renseigné"}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Société</p>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {/* Affichage direct du nom de la société si le backend la charge */}
                        {client.companyName || "Société inconnue"}
                      </p>

                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Équipements</p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {client.equipmentDetails || "N/A"}
                      </p>

                      {Array.isArray(client.remoteAccess) && client.remoteAccess.length > 0 && (
                          <div className="mt-4 pt-4 border-t dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                              Accès à distance
                            </p>
                            <div className="space-y-3">
                              {client.remoteAccess.map((access) =>
                                  access.url ? (
                                      <button
                                          key={access.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(access.url, "_blank");
                                          }}
                                          className="w-full flex items-center gap-3 bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
                                      >
                                        <Globe className="h-5 w-5 text-green-400" />
                                        <div className="text-left">
                                          <p className="text-sm font-medium text-white">
                                            {access.type || "Type inconnu"}
                                          </p>
                                          <p className="text-xs text-gray-300">
                                            {access.username || "N/A"}
                                          </p>
                                        </div>
                                      </button>
                                  ) : null
                              )}
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
              ))
          ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Aucun client trouvé. 📌 Vérifiez la console pour plus d'informations.
              </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
              onClick={() => setPage(prev => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="btn-secondary"
          >
            Précédent
          </button>
          <span className="text-sm text-gray-300">
          Page {page + 1} / {totalPages}
        </span>
          <button
              onClick={() => setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev))}
              disabled={page + 1 >= totalPages}
              className="btn-secondary"
          >
            Suivant
          </button>
        </div>

        {/* Modal : Ajouter un client */}
        {showAddModal && (
            <FormModal
                title="Nouveau client"
                onClose={() => setShowAddModal(false)}
            >
              <ClientForm
                  onSubmit={handleAddClient}
                  onCancel={() => setShowAddModal(false)}
              />
            </FormModal>
        )}

        {/* Modal : Modifier un client */}
        {editingClient && (
            <FormModal
                title="Modifier le client"
                onClose={() => setEditingClient(null)}
            >
              <ClientForm
                  initialData={editingClient}
                  onSubmit={handleEditClient}
                  onCancel={() => setEditingClient(null)}
              />
            </FormModal>
        )}
      </div>
  );
};
