import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  X,
  Monitor,
  Globe,
  Key,
  MessageSquare
} from "lucide-react";
import axios from "axios";

/** ---------- Types adaptables à votre modèle ---------- **/
interface Company {
  id: number;
  name: string;
}

interface RemoteAccessItem {
  id?: string;
  type: string;
  url?: string;
  username?: string;
  password?: string;
}

interface Client {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  equipmentDetails?: string;
  remoteAccess?: RemoteAccessItem[];
  company: Company;
}

export type Priority = "BASSE" | "MOYENNE" | "HAUTE" | "URGENTE";
export type TicketStatus = "OUVERT" | "EN_COURS" | "RESOLU" | "FERME";

export interface Incident {
  id: number;
  callerName: string;
  callerPhone: string;
  description: string;
  priority: Priority;
  notes?: string;
  status: TicketStatus;
  createdAt: string; // format ISO
  client: Client;
}

export interface Technician {
  id: string;
  name: string;
  availability: string;
  specialization: string;
}

interface IncidentsTableProps {
  incidents?: Incident[];
  technicians: Technician[];
  onUpdateIncident: (updatedIncident: Incident) => void;
  onDeleteIncident: (incidentId: number) => void;
  onAssignTechnician: (incidentId: number, technicianId: string) => void;
  onCreateIncident: (newIncident: Omit<Incident, "id">) => void;
}

/** ---------- Constantes d'affichage ---------- **/
const priorityColors: Record<Priority, string> = {
  BASSE: "bg-green-100 text-green-800",
  MOYENNE: "bg-blue-100 text-blue-800",
  HAUTE: "bg-yellow-100 text-yellow-800",
  URGENTE: "bg-red-100 text-red-800"
};

const priorityLabels: Record<Priority, string> = {
  BASSE: "Basse",
  MOYENNE: "Moyenne",
  HAUTE: "Haute",
  URGENTE: "Urgente"
};

const statusColors: Record<TicketStatus, string> = {
  OUVERT: "bg-blue-100 text-blue-800",
  EN_COURS: "bg-purple-100 text-purple-800",
  RESOLU: "bg-green-100 text-green-800",
  FERME: "bg-gray-100 text-gray-800"
};

const statusLabels: Record<TicketStatus, string> = {
  OUVERT: "Ouvert",
  EN_COURS: "En cours",
  RESOLU: "Résolu",
  FERME: "Fermé"
};

export const IncidentsTable: React.FC<IncidentsTableProps> = ({
                                                                incidents: initialIncidents = [],
                                                                technicians,
                                                                onUpdateIncident,
                                                                onDeleteIncident,
                                                                onAssignTechnician,
                                                                onCreateIncident
                                                              }) => {

  /** ----- États pour la liste des incidents ----- **/
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  /** ----- États pour la pagination ----- **/
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  /** ----- Tri ----- **/
  const [sortField, setSortField] = useState<keyof Incident>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  /** ----- Sélection d’un incident et client ----- **/
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  /** ----- Assignation, commentaires, filtres ----- **/
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [comment, setComment] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  /** ----- Filtres ----- **/
  const [filters, setFilters] = useState({
    status: ["OUVERT", "EN_COURS"] as TicketStatus[],
    priority: ["URGENTE", "HAUTE", "MOYENNE", "BASSE"] as Priority[],
    dateRange: {
      start: null as Date | null,
      end: null as Date | null
    }
  });

  /** ----- Charger la liste des incidents (sans remote_access) ----- **/
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:8080/api/tickets", {
      params: { page, size: 20 } // si pagination backend
    })
        .then((response) => {
          console.log("✅ Incidents reçus :", response.data);
          if (response.data && Array.isArray(response.data.content)) {
            setIncidents(response.data.content);
            setTotalPages(response.data.totalPages || 1);
          } else if (Array.isArray(response.data)) {
            setIncidents(response.data);
            setTotalPages(1);
          } else {
            console.error("❌ Format inattendu :", response.data);
            setIncidents([]);
          }
        })
        .catch((error) => {
          console.error("❌ Erreur lors du chargement :", error);
          setIncidents([]);
        })
        .finally(() => setLoading(false));
  }, [page]);

  /** ----- Mettre à jour selectedClient quand selectedIncident change ----- **/
  useEffect(() => {
    if (selectedIncident && selectedIncident.client) {
      setSelectedClient(selectedIncident.client);
    } else {
      setSelectedClient(null);
    }
  }, [selectedIncident]);

  /** ----- Assignation technicien ----- **/
  const handleAssignTechnician = useCallback(() => {
    if (!selectedIncident || !selectedTechnician) return;
    onAssignTechnician(selectedIncident.id, selectedTechnician);
    setSelectedTechnician("");
  }, [selectedIncident, selectedTechnician, onAssignTechnician]);

  /** ----- Ajouter un commentaire ----- **/
  const handleAddComment = useCallback(() => {
    if (!selectedIncident || !comment.trim()) return;
    onUpdateIncident({
      ...selectedIncident,
      notes: selectedIncident.notes
          ? `${selectedIncident.notes}\n\n${comment}`
          : comment
    });
    setComment("");
  }, [selectedIncident, comment, onUpdateIncident]);

  /** ----- Filtrage local ----- **/
  const handleStatusFilter = (status: TicketStatus) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
          ? prev.status.filter(s => s !== status)
          : [...prev.status, status]
    }));
  };

  const handlePriorityFilter = (priority: Priority) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
          ? prev.priority.filter(p => p !== priority)
          : [...prev.priority, priority]
    }));
  };

  const handleDateRangeFilter = (start: Date | null, end: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  };

  const filteredIncidents = useMemo(() => {
    if (!Array.isArray(incidents)) return [];
    return incidents.filter(incident => {
      const incidentDate = new Date(incident.createdAt);
      return (
          filters.status.includes(incident.status) &&
          filters.priority.includes(incident.priority) &&
          (!filters.dateRange.start || incidentDate >= filters.dateRange.start) &&
          (!filters.dateRange.end || incidentDate <= filters.dateRange.end)
      );
    });
  }, [incidents, filters]);

  const sortedIncidents = useMemo(() => {
    if (!Array.isArray(filteredIncidents)) return [];
    return [...filteredIncidents].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredIncidents, sortField, sortDirection]);

  const handleSort = (field: keyof Incident) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  /** ----- Construire remoteAccessMap depuis selectedClient?.remoteAccess ----- **/
  const remoteAccessMap = useMemo(() => {
    if (!selectedClient || !selectedClient.remoteAccess) return {};
    return selectedClient.remoteAccess.reduce((acc, item) => {
      if (item.type) {
        acc[item.type] = item;
      }
      return acc;
    }, {} as Record<string, RemoteAccessItem>);
  }, [selectedClient]);

  /** ----- Affichage "Chargement" ou "Aucun ticket" ----- **/
  if (loading) {
    return <div className="text-center p-4">Chargement des tickets...</div>;
  }
  if (!Array.isArray(sortedIncidents) || sortedIncidents.length === 0) {
    return <div className="p-4 text-center text-gray-500">Aucun ticket trouvé</div>;
  }

  /** ---------- Retour complet ---------- **/
  return (
      <div className="card space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Tickets incidents</h2>
          <button
              className="btn-secondary flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filtrer
          </button>
        </div>

      {/* Filtres */}
      {showFilters && (
          <div className="bg-gray-700/50 p-4 rounded-lg space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Filtre Statut */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Statut</h3>
                <div className="flex gap-2">
                  {(["OUVERT", "EN_COURS", "RESOLU", "FERME"] as TicketStatus[]).map(status => (
                      <label key={status} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={filters.status.includes(status)}
                            onChange={() => handleStatusFilter(status)}
                            className="rounded text-blue-600 bg-gray-600 border-gray-500"
                        />
                        <span className="text-sm text-gray-300">{status}</span>
                      </label>
                  ))}
                </div>
              </div>

              {/* Filtre Priorité */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Priorité</h3>
                <div className="flex gap-2">
                  {(["URGENTE", "HAUTE", "MOYENNE", "BASSE"] as Priority[]).map(priority => (
                      <label key={priority} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={filters.priority.includes(priority)}
                            onChange={() => handlePriorityFilter(priority)}
                            className="rounded text-blue-600 bg-gray-600 border-gray-500"
                        />
                        <span className="text-sm text-gray-300">{priority}</span>
                      </label>
                  ))}
                </div>
              </div>

              {/* Filtre Période */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Période</h3>
                <div className="flex gap-2">
                  <input
                      type="date"
                      className="input-field py-1 px-2 text-sm"
                      onChange={(e) =>
                          handleDateRangeFilter(
                              e.target.value ? new Date(e.target.value) : null,
                              filters.dateRange.end
                          )
                      }
                  />
                  <input
                      type="date"
                      className="input-field py-1 px-2 text-sm"
                      onChange={(e) =>
                          handleDateRangeFilter(
                              filters.dateRange.start,
                              e.target.value ? new Date(e.target.value) : null
                          )
                      }
                  />
                </div>
              </div>
            </div>
          </div>
      )}

        {/* Tableau des tickets */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Société</th>
              <th className="table-header">Client</th>
              <th className="table-header">Problème</th>
              <th
                  className="table-header cursor-pointer hover:bg-gray-700/50"
                  onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-2">
                  Date
                  {sortField === "createdAt" &&
                      (sortDirection === "desc" ? <ChevronDown size={16} /> : <ChevronUp size={16} />)}
                </div>
              </th>
              <th className="table-header">Priorité</th>
              <th className="table-header">Statut</th>
              <th className="table-header">Actions</th>
            </tr>
            </thead>
            <tbody>
            {sortedIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-700/50">
                  <td className="table-cell font-mono">{incident.id.toString().slice(-4)}</td>
                  <td className="table-cell">{incident.client?.company?.name}</td>
                  <td className="table-cell">{incident.client?.name}</td>
                  <td className="table-cell max-w-md truncate">{incident.description}</td>
                  <td className="table-cell whitespace-nowrap">
                    {new Date(incident.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td className="table-cell">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityColors[incident.priority]}`}>
                    {priorityLabels[incident.priority]}
                  </span>
                  </td>
                  <td className="table-cell">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[incident.status]}`}>
                    {statusLabels[incident.status]}
                  </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Voir les détails"
                          onClick={() => {
                            setSelectedIncident(incident);
                          }}
                      >
                        <Eye size={18} />
                      </button>
                      {incident.status === "OUVERT" && (
                          <button
                              className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                              title="Assigner un technicien"
                              onClick={() => setSelectedIncident(incident)}
                          >
                            <UserPlus size={18} />
                          </button>
                      )}
                      <button
                          className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                          title="Modifier"
                          onClick={() => setSelectedIncident(incident)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Supprimer"
                          onClick={() => onDeleteIncident(incident.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="btn-secondary"
          >
            Précédent
          </button>
          <span className="text-sm text-gray-300">
          Page {page + 1} / {totalPages}
        </span>
          <button
              onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
              disabled={page + 1 >= totalPages}
              className="btn-secondary"
          >
            Suivant
          </button>
        </div>

        {/* ---------- Panneau latéral de détail du ticket ---------- */}
        {/** EXACTEMENT selon le schéma que vous avez fourni **/}
        {selectedIncident && selectedClient && (() => {
          // Construire remoteAccessMap
          const remoteAccessMap = selectedClient.remoteAccess
              ? selectedClient.remoteAccess.reduce((acc, item) => {
                if (item.type) {
                  acc[item.type] = item;
                }
                return acc;
              }, {} as Record<string, RemoteAccessItem>)
              : {};

          return (
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
                          <span className={`status-badge ${priorityColors[selectedIncident.priority]}`}>
                        {priorityLabels[selectedIncident.priority]}
                      </span>
                        </div>
                        <p className="text-gray-400">
                          {selectedIncident.client?.company?.name} - {selectedIncident.client?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Créé le{" "}
                          {new Date(selectedIncident.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
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
                      {/* Bloc de 2 colonnes */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* Colonne 1 */}
                        <div className="space-y-6">
                          {/* Description */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">
                              Description du problème
                            </h4>
                            <div className="bg-gray-700/50 rounded-lg p-4">
                              <p className="text-white">{selectedIncident.description}</p>
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
                                <p className="text-white text-sm">{selectedClient.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Équipements</p>
                                <p className="text-white">{selectedClient.equipmentDetails}</p>
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
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Accès à distance</h4>
                            {Object.keys(remoteAccessMap).length > 0 ? (
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
                            ) : (
                                <p className="text-gray-500 italic">Aucun accès distant disponible</p>
                            )}
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
                                      {selectedIncident.notes.split("\n\n").map((note, index) => (
                                          <div key={index} className="bg-gray-600/50 rounded p-3">
                                            <p className="text-white whitespace-pre-line">{note}</p>
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
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Statut du ticket</h4>
                            <div className="bg-gray-700/50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-4">
                            <span className={`status-badge ${statusColors[selectedIncident.status]}`}>
                              {statusLabels[selectedIncident.status]}
                            </span>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-400">Dernière mise à jour</p>
                                <p className="text-white">
                                  {new Date(selectedIncident.createdAt).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions rapides */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Actions rapides</h4>
                            <div className="space-y-2">
                              <button className="btn-secondary w-full">Marquer comme résolu</button>
                              <button className="btn-secondary w-full">Transférer le ticket</button>
                              <button className="btn-secondary w-full text-red-500 hover:text-red-600">
                                Supprimer le ticket
                              </button>
                            </div>
                          </div>

                          {/* Pièces jointes */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Pièces jointes</h4>
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
          );
        })()}
      </div>
  );
};
