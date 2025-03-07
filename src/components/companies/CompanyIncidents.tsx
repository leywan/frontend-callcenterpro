import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Filter,
  Eye,
  X,
  UserPlus,
  Monitor,
  Globe,
  Key,
  MessageSquare
} from "lucide-react";

/** TYPES **/

// Représente un accès distant (TeamViewer, Danfoss, etc.)
interface RemoteAccess {
  id: number;
  type: string;           // "teamviewer", "danfoss", "akm"
  url?: string;
  username?: string;
  password?: string;
}

// Représente la société
interface Company {
  id: number;
  name: string;
}

// Représente le client (avec ses accès distants)
interface ExtendedClient {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  equipmentDetails?: string;
  remoteAccess?: RemoteAccess[];
  company?: Company;
}

// Priorités possibles
type Priority = "BASSE" | "MOYENNE" | "HAUTE" | "URGENTE";

// Statuts possibles
type TicketStatus = "OUVERT" | "EN_COURS" | "RESOLU" | "FERME";

// Représente un technicien
interface Technician {
  id: string;
  name: string;
  availability: string;   // "available" ou autre
  specialization: string;
}

// Représente un ticket (incident)
interface Incident {
  id: number;
  description: string;
  priority: Priority;
  status: TicketStatus;
  createdAt: string;        // date ISO
  notes?: string;
  client: ExtendedClient;
}

/** PROPS DU COMPOSANT **/
interface CompanyIncidentsProps {
  companyId: string;
}

/** TABLEAUX DE LABELS/COULEURS **/

// Couleurs pour la priorité
const priorityColors: Record<Priority, string> = {
  BASSE: "bg-green-100 text-green-800",
  MOYENNE: "bg-blue-100 text-blue-800",
  HAUTE: "bg-yellow-100 text-yellow-800",
  URGENTE: "bg-red-100 text-red-800"
};

// Labels pour la priorité
const priorityLabels: Record<Priority, string> = {
  BASSE: "Basse",
  MOYENNE: "Moyenne",
  HAUTE: "Haute",
  URGENTE: "Urgente"
};

// Couleurs pour le statut
const statusColors: Record<TicketStatus, string> = {
  OUVERT: "bg-blue-100 text-blue-800",
  EN_COURS: "bg-purple-100 text-purple-800",
  RESOLU: "bg-green-100 text-green-800",
  FERME: "bg-gray-300 text-gray-800"
};

// Labels pour le statut
const statusLabels: Record<TicketStatus, string> = {
  OUVERT: "Ouvert",
  EN_COURS: "En cours",
  RESOLU: "Résolu",
  FERME: "Fermé"
};

export const CompanyIncidents: React.FC<CompanyIncidentsProps> = ({ companyId }) => {

  // État pour stocker les tickets (incidents) de la société
  const [companyIncidents, setCompanyIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // État pour gérer l'incident sélectionné (pour le slide)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // État pour la liste des techniciens (exemple)
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  // État pour l'assignation d'un technicien
  const [selectedTechnician, setSelectedTechnician] = useState("");

  // État pour un nouveau commentaire
  const [comment, setComment] = useState("");

  /**
   * CHARGEMENT DES TICKETS DE L'ENTREPRISE
   */
  useEffect(() => {
    async function fetchIncidents() {
      try {
        const response = await axios.get(`http://localhost:8080/api/companies/${companyId}/tickets`);
        setCompanyIncidents(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des tickets :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchIncidents();
  }, [companyId]);

  /**
   * FONCTION POUR ASSIGNER UN TECHNICIEN
   */
  const handleAssignTechnician = () => {
    if (!selectedIncident || !selectedTechnician) return;
    console.log(`Assignation du technicien ${selectedTechnician} au ticket ${selectedIncident.id}`);
    // Ici, on ferait un appel API pour assigner le technicien
    setSelectedTechnician("");
  };

  /**
   * FONCTION POUR AJOUTER UN COMMENTAIRE
   */
  const handleAddComment = () => {
    if (!selectedIncident || !comment.trim()) return;
    console.log(`Ajout d'un commentaire : ${comment} au ticket ${selectedIncident.id}`);

    // Exemple local : on concatène dans selectedIncident.notes
    selectedIncident.notes = selectedIncident.notes
        ? `${selectedIncident.notes}\n\n${comment}`
        : comment;
    setComment("");
  };

  /**
   * CRÉATION DE L'OBJET remoteAccessMap (pour accéder plus facilement aux accès distants)
   */
  const selectedClient = selectedIncident?.client;
  const remoteAccessMap = selectedClient?.remoteAccess
      ? selectedClient.remoteAccess.reduce((acc, item) => {
        acc[item.type] = item;
        return acc;
      }, {} as Record<string, RemoteAccess>)
      : {};

  /**
   * SI ENCORE EN CHARGEMENT
   */
  if (loading) {
    return <div className="text-center p-4">Chargement des incidents...</div>;
  }

  return (
      <div>
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Incidents ({companyIncidents.length})
          </h3>
          <div className="flex gap-4">
            <button className="btn-secondary flex items-center gap-2">
              <Filter size={20} />
              Filtrer
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Nouveau ticket
            </button>
          </div>
        </div>

        {/* Tableau des tickets */}
        <div className="table-container">
          <table className="w-full">
            <thead>
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Client</th>
              <th className="table-header">Problème</th>
              <th className="table-header">Date</th>
              <th className="table-header">Priorité</th>
              <th className="table-header">Statut</th>
              <th className="table-header">Actions</th>
            </tr>
            </thead>
            <tbody>
            {companyIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    Aucun ticket trouvé pour cette entreprise.
                  </td>
                </tr>
            ) : (
                companyIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td className="table-cell font-mono">
                        {incident.id.toString()}
                      </td>
                      <td className="table-cell">{incident.client.name}</td>
                      <td className="table-cell">{incident.description}</td>
                      <td className="table-cell">
                        {new Date(incident.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="table-cell">
                    <span
                        className={`status-badge ${priorityColors[incident.priority]}`}
                    >
                      {priorityLabels[incident.priority]}
                    </span>
                      </td>
                      <td className="table-cell">
                    <span
                        className={`status-badge ${statusColors[incident.status]}`}
                    >
                      {statusLabels[incident.status]}
                    </span>
                      </td>
                      <td className="table-cell">
                        <button
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            title="Voir les détails"
                            onClick={() => setSelectedIncident(incident)}
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>

        {/* Slide latéral si un incident est sélectionné */}
        {selectedIncident && selectedClient && (
            <div className="fixed inset-y-0 right-0 w-[1000px] bg-gray-800 border-l border-gray-700 shadow-xl transform transition-transform z-50">
              <div className="h-full flex flex-col">
                {/* En-tête */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-white">
                          Ticket #{selectedIncident.id.toString().slice(-4)}
                        </h3>
                        <span
                            className={`status-badge ${
                                priorityColors[selectedIncident.priority]
                            }`}
                        >
                      {priorityLabels[selectedIncident.priority]}
                    </span>
                      </div>
                      <p className="text-gray-400">
                        {selectedIncident.client.company?.name} -{" "}
                        {selectedIncident.client.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Créé le{" "}
                        {new Date(selectedIncident.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                        )}
                      </p>
                    </div>
                    <button
                        onClick={() => setSelectedIncident(null)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* 2 colonnes */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Colonne 1 */}
                      <div className="space-y-6">
                        {/* Description */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Description du problème
                          </h4>
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <p className="text-white">
                              {selectedIncident.description}
                            </p>
                          </div>
                        </div>

                        {/* Infos client */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Informations du client
                          </h4>
                          <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                            <div>
                              <p className="text-sm text-gray-400">Adresse</p>
                              <p className="text-white">{selectedClient.address}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Contact</p>
                              <p className="text-white">{selectedClient.phone}</p>
                              <p className="text-white text-sm">
                                {selectedClient.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Équipements</p>
                              <p className="text-white">
                                {selectedClient.equipmentDetails}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Assignation */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Assigner un technicien
                          </h4>
                          <div className="space-y-2">
                            <select
                                value={selectedTechnician}
                                onChange={(e) => setSelectedTechnician(e.target.value)}
                                className="input-field"
                            >
                              <option value="">Sélectionner un technicien</option>
                              {technicians
                                  .filter((tech) => tech.availability === "available")
                                  .map((tech) => (
                                      <option key={tech.id} value={tech.id}>
                                        {tech.name} - {tech.specialization}
                                      </option>
                                  ))}
                            </select>
                            <button
                                onClick={handleAssignTechnician}
                                disabled={!selectedTechnician}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                              <UserPlus size={20} />
                              Assigner
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Colonne 2 */}
                      <div className="space-y-6">
                        {/* Accès à distance */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Accès à distance
                          </h4>
                          {/* Création d'un objet remoteAccessMap depuis le tableau remoteAccess[] */}
                          {(() => {
                            const remoteAccessArray = selectedClient.remoteAccess || [];
                            const remoteAccessMap = remoteAccessArray.reduce((acc, item) => {
                              acc[item.type] = item;
                              return acc;
                            }, {} as Record<string, RemoteAccess>);

                            if (Object.keys(remoteAccessMap).length > 0) {
                              return (
                                  <div className="space-y-2">
                                    {remoteAccessMap.teamviewer && (
                                        <a
                                            href={`teamviewer8://remotecontrol/?id=${remoteAccessMap.teamviewer.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-all cursor-pointer"
                                        >
                                          <Monitor className="h-5 w-5 text-blue-400" />
                                          <div className="text-left">
                                            <p className="text-white font-semibold">TeamViewer</p>
                                            <p className="text-sm text-gray-400">
                                              ID: {remoteAccessMap.teamviewer.id}
                                            </p>
                                          </div>
                                        </a>
                                    )}

                                    {remoteAccessMap.danfoss && (
                                        <a
                                            href={remoteAccessMap.danfoss.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-all cursor-pointer"
                                        >
                                          <Globe className="h-5 w-5 text-green-400" />
                                          <div className="text-left">
                                            <p className="text-white font-semibold">Danfoss</p>
                                            <p className="text-sm text-gray-400">
                                              Utilisateur: {remoteAccessMap.danfoss.username}
                                            </p>
                                          </div>
                                        </a>
                                    )}

                                    {remoteAccessMap.akm && (
                                        <a
                                            href={remoteAccessMap.akm.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-all cursor-pointer"
                                        >
                                          <Key className="h-5 w-5 text-yellow-400" />
                                          <div className="text-left">
                                            <p className="text-white font-semibold">AKM</p>
                                            <p className="text-sm text-gray-400">
                                              Utilisateur: {remoteAccessMap.akm.username}
                                            </p>
                                          </div>
                                        </a>
                                    )}
                                  </div>
                              );
                            } else {
                              return (
                                  <p className="text-gray-500 italic">
                                    Aucun accès distant disponible
                                  </p>
                              );
                            }
                          })()}
                        </div>

                        {/* Historique et commentaires */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Historique et commentaires
                          </h4>
                          <div className="bg-gray-700/50 rounded-lg p-4 space-y-4">
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                              {selectedIncident.notes && (
                                  <div className="space-y-2">
                                    {selectedIncident.notes
                                        .split("\n\n")
                                        .map((note, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-600/50 rounded p-3"
                                            >
                                              <p className="text-white whitespace-pre-line">
                                                {note}
                                              </p>
                                            </div>
                                        ))}
                                  </div>
                              )}
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-gray-600">
                              <input
                                  type="text"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  placeholder="Ajouter un commentaire..."
                                  className="input-field flex-1"
                              />
                              <button
                                  onClick={handleAddComment}
                                  disabled={!comment.trim()}
                                  className="btn-primary px-4"
                              >
                                <MessageSquare size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section inférieure */}
                    <div className="border-t border-gray-700 pt-6">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Statut du ticket */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Statut du ticket
                          </h4>
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                          <span
                              className={`status-badge ${
                                  statusColors[selectedIncident.status]
                              }`}
                          >
                            {statusLabels[selectedIncident.status]}
                          </span>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-400">
                                Dernière mise à jour
                              </p>
                              <p className="text-white">
                                {new Date(selectedIncident.createdAt).toLocaleDateString(
                                    "fr-FR",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions rapides */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Actions rapides
                          </h4>
                          <div className="space-y-2">
                            <button className="btn-secondary w-full">
                              Marquer comme résolu
                            </button>
                            <button className="btn-secondary w-full">
                              Transférer le ticket
                            </button>
                            <button className="btn-secondary w-full text-red-500 hover:text-red-600">
                              Supprimer le ticket
                            </button>
                          </div>
                        </div>

                        {/* Pièces jointes */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Pièces jointes
                          </h4>
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-lg">
                              <p className="text-gray-400 text-center">
                                Glissez et déposez des fichiers ici
                                <br />
                                ou cliquez pour ajouter
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};
