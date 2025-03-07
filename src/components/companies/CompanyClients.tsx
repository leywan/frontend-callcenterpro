import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getClients, deleteClient, createClient, updateClient } from '../../services/api';
import { Client } from '../../types';
import { ClientForm } from '../forms/ClientForm';
import { FormModal } from '../modals/FormModal';
import { Button } from '../ui/button.tsx';
import { ImportExportClients } from '../clients/ImportExportClients.tsx';
import axios from "axios";

interface CompanyClientsProps {
  companyId: string;
}

export const CompanyClients: React.FC<CompanyClientsProps> = ({ companyId }) => {
  const [companyClients, setCompanyClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Partial<Client> | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20; // 🔥 Nombre de clients par page
  const [clients, setClients] = useState<Client[]>([]);


// Fonction pour récupérer les clients avec pagination
  const fetchClients = async (page = 0) => {
    try {
      setLoading(true);

      if (!companyId) {
        console.warn("⚠️ companyId est NULL ou UNDEFINED !");
        setError("Impossible de charger les clients : ID de société manquant.");
        setLoading(false);
        return;
      }

      // 🔥 Récupération des clients paginés
      const response = await axios.get(
          `/api/clients?companyId=${companyId}&page=${page}&size=${pageSize}`
      );

      console.log("📡 Réponse API Clients:", response.data); // Debug

      // ✅ Vérifier si la structure de la réponse est correcte
      const clientsData = response.data?.content;
      if (!Array.isArray(clientsData)) {
        throw new Error("⚠️ La réponse API clients ne contient pas de liste valide !");
      }

      if (clientsData.length === 0) {
        // ✅ Aucun client trouvé
        setError("Aucun client trouvé pour cette société.");
      } else {
        // ✅ On vide le message d'erreur si la liste n'est pas vide
        setError(null);
      }

      setCompanyClients(clientsData);
      setCurrentPage(page);
    } catch (err) {
      setError("Erreur lors du chargement des clients.");
      console.error("❌ Erreur API clients:", err);
    } finally {
      setLoading(false);
    }
  };


// 📡 Charger la liste des clients associés à la permanence dès le montage
  useEffect(() => {
    fetchClients();
  }, [companyId]);

  // 🆕 Ajouter un client
  const handleAddClient = () => {
    setSelectedClient({companyId, status: 'active'});
    setIsFormOpen(true);
  };

  // 📝 Modifier un client
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  // ❌ Supprimer un client
  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
      try {
        await deleteClient(clientId);
        setCompanyClients(prev => prev.filter(client => client.id !== clientId));
      } catch (err) {
        console.error('❌ Erreur lors de la suppression du client:', err);
      }
    }
  };

  // 💾 Enregistrer (ajout/mise à jour) un client
  const handleSubmitClient = async (updatedClient: Partial<Client>) => {
    try {
      if (updatedClient.id) {
        const updated = await updateClient(updatedClient.id, {
          ...updatedClient,
          status: updatedClient.status || 'inactive', // 🔥 S'assurer que status est bien transmis
        });

        setCompanyClients(prevClients =>
            prevClients.map(client => (client.id === updated.id ? updated : client))
        );
      } else {
        const newClient = await createClient({
          ...updatedClient,
          companyId,
          status: updatedClient.status || 'active', // 🔥 Par défaut actif à la création
        });

        const allClients = await getClients();
        const filteredClients = allClients.filter(client => client.companyId?.toString() === companyId.toString());
        setCompanyClients(filteredClients);
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout/mise à jour du client :', error);
    }
  };

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Clients ({companyClients.length})</h3>
          <div className="flex gap-4">
            <ImportExportClients companyId={companyId} onImportSuccess={() => fetchClients(0)} />
            <Button className="btn-primary flex items-center gap-2" onClick={handleAddClient}>
              <Plus size={20} />
              Ajouter un client
            </Button>
          </div>
        </div>

        {loading ? (
            <p className="text-gray-500">Chargement des clients...</p>
        ) : error ? (
            <p className="text-red-500">{error}</p>
        ) : companyClients.length === 0 ? (
            <p className="text-gray-500">Aucun client associé à cette permanence.</p>
        ) : (
            <div>
              <div className="table-container">
                <table className="w-full">
                  <thead>
                  <tr>
                    <th className="table-header">Nom</th>
                    <th className="table-header">Adresse</th>
                    <th className="table-header">Contact</th>
                    <th className="table-header">Équipements</th>
                    <th className="table-header">Statut</th>
                    <th className="table-header">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {companyClients.map((client) => (
                      <tr key={client.id}>
                        <td className="table-cell font-medium">{client.name}</td>
                        <td className="table-cell">{client.address}</td>
                        <td className="table-cell">
                          <div>
                            <p>{client.phone || "N/A"}</p>
                            <p className="text-sm text-gray-500">{client.email || "N/A"}</p>
                          </div>
                        </td>
                        <td className="table-cell">{client.equipments || "N/A"}</td>
                        <td className="table-cell">
                    <span
                        className={`status-badge ${
                            client.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {client.status === "active" ? "Actif" : "Inactif"}
                    </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEditClient(client)}>
                              <Edit size={18} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDeleteClient(client.id)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ PAGINATION */}
              <div className="flex justify-center mt-4">
                <button
                    className="btn-primary"
                    onClick={() => fetchClients(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                  Précédent
                </button>
                <span className="mx-4">Page {currentPage + 1}</span>
                <button
                    className="btn-primary"
                    onClick={() => fetchClients(currentPage + 1)}
                    disabled={companyClients.length < pageSize}
                >
                  Suivant
                </button>
              </div>
            </div>
        )}

        {/* ✅ MODAL pour ajout/modif client */}
        {isFormOpen && (
            <FormModal title={selectedClient?.id ? "Modifier le client" : "Ajouter un client"} onClose={() => setIsFormOpen(false)}>
              <ClientForm initialData={selectedClient} onSubmit={handleSubmitClient} onCancel={() => setIsFormOpen(false)} />
            </FormModal>
        )}
      </div>
  );
};