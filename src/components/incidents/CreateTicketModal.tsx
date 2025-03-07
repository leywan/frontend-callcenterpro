import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import type { Incident, Client, Company } from "../../types";

interface CreateTicketModalProps {
  initialClient: Client;
  onClose: () => void;
  onSubmit: (ticket: Omit<Incident, "id">) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
                                                                      initialClient,
                                                                      onClose,
                                                                      onSubmit,
                                                                    }) => {
  const [formData, setFormData] = useState({
    companyId: initialClient.companyId,
    clientId: initialClient.id,
    issue: "",
    priority: "MOYENNE" as Incident["priority"],
    notes: "",
    caller: {
      name: "",
      phone: "",
    },
  });

  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Charger la liste des companies depuis l'API Spring Boot
  useEffect(() => {
    axios
        .get("http://localhost:8080/api/companies")
        .then((response) => setCompanies(response.data))
        .catch((error) => console.error("Erreur lors du chargement des companies", error));
  }, []);

  // Fonction d'envoi des tickets à l'API Spring Boot
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8080/api/tickets", {
        callerName: formData.caller.name,
        clientId: formData.clientId,
        priority: formData.priority.toUpperCase(), // Correspondance avec l'Enum Spring Boot
        description: formData.issue,
        status: "OUVERT", // Statut par défaut
        notes: formData.notes,
      });

      console.log("✅ Ticket créé avec succès :", response.data);
      onSubmit(response.data);
      onClose();
    } catch (error) {
      console.error("❌ Erreur lors de la création du ticket :", error);
      setErrorMessage("Une erreur est survenue lors de la création du ticket.");
    }

    setLoading(false);
  };

  const company = companies?.find((c) => c.id === initialClient.companyId);

  return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl border border-gray-700">
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-semibold text-white">Nouveau ticket</h2>
              <p className="text-gray-400 mt-1">
                {initialClient.name} - {company ? company.name : "Chargement..."}
              </p>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nom de l'appelant
                </label>
                <input
                    type="text"
                    value={formData.caller.name}
                    onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          caller: { ...prev.caller, name: e.target.value },
                        }))
                    }
                    className="input-field"
                    required
                    placeholder="Nom et prénom"
                    autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Téléphone de l'appelant
                </label>
                <input
                    type="tel"
                    value={formData.caller.phone}
                    onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          caller: { ...prev.caller, phone: e.target.value },
                        }))
                    }
                    className="input-field"
                    required
                    placeholder="Numéro de téléphone"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description du problème
              </label>
              <textarea
                  value={formData.issue}
                  onChange={(e) =>
                      setFormData((prev) => ({ ...prev, issue: e.target.value }))
                  }
                  className="input-field"
                  rows={4}
                  required
                  placeholder="Décrivez le problème rencontré..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Priorité
              </label>
              <select
                  value={formData.priority}
                  onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: e.target.value as Incident["priority"],
                      }))
                  }
                  className="input-field"
                  required
              >
                <option value="BASSE">Basse</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="HAUTE">Haute</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Notes additionnelles
              </label>
              <textarea
                  value={formData.notes}
                  onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="input-field"
                  rows={3}
                  placeholder="Informations complémentaires..."
              />
            </div>

            {/* Gestion des erreurs */}
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
              <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
              >
                Annuler
              </button>
              <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
              >
                {loading ? "Création..." : "Créer le ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};
