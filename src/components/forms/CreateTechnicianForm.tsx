import React, { useEffect, useState } from "react";
import { Technician, Company } from "../../types";
import { getCompanies } from "../../services/api";

interface TechnicianFormProps {
  initialData?: Partial<Technician>;
  onSubmit: (data: Partial<Technician>) => void;
  onCancel: () => void;
}

export const TechnicianForm: React.FC<TechnicianFormProps> = ({
                                                                initialData,
                                                                onSubmit,
                                                                onCancel,
                                                              }) => {
  // État pour stocker la liste des sociétés récupérées depuis l’API
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des sociétés :", error);
      }
    }
    fetchCompanies();
  }, []);

  // État du formulaire, avec comme valeur par défaut la première société (si disponible)
  const [formData, setFormData] = useState<Partial<Technician>>({
    name: "",
    companyId: "", // On va renseigner cet ID après récupération des sociétés
    phone: "",
    email: "",
    specialization: "",
    availability: "available",
    isOnDuty: false,
    ...initialData,
  });

  // Lorsque les sociétés sont chargées et que companyId n'est pas défini, on choisit la première
  useEffect(() => {
    if (!formData.companyId && companies.length > 0) {
      setFormData((prev) => ({ ...prev, companyId: companies[0].id }));
    }
  }, [companies, formData.companyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom du technicien et Société */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Nom du technicien
            </label>
            <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input-field"
                required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Société de maintenance
            </label>
            <select
                value={formData.companyId || ""}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, companyId: e.target.value }))
                }
                className="input-field"
                required
            >
              <option value="">Sélectionner une société</option>
              {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
              ))}
            </select>
          </div>
        </div>

        {/* Téléphone & Email */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Téléphone
            </label>
            <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="input-field"
                required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Email
            </label>
            <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="input-field"
                required
            />
          </div>
        </div>

        {/* Expertise */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Expertise
          </label>
          <input
              type="text"
              value={formData.specialization || ""}
              onChange={(e) =>
                  setFormData((prev) => ({ ...prev, specialization: e.target.value }))
              }
              className="input-field"
              required
          />
        </div>

        {/* Disponibilité */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Disponibilité
          </label>
          <select
              value={formData.availability || "available"}
              onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability: e.target.value as Technician["availability"],
                  }))
              }
              className="input-field"
          >
            <option value="available">Disponible</option>
            <option value="busy">Occupé</option>
            <option value="offline">Hors ligne</option>
          </select>
        </div>

        {/* En service */}
        <div>
          <label className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={formData.isOnDuty || false}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isOnDuty: e.target.checked }))
                }
                className="rounded text-blue-600"
            />
            <span>En service</span>
          </label>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            {initialData ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </form>
  );
};

export default TechnicianForm;
