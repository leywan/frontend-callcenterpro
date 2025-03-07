import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { TechnicianForm } from "../forms/TechnicianForm.tsx";

interface Technician {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  availability: "available" | "busy" | "offline";
  companyId: string;
}

interface CompanyTechniciansProps {
  companyId: string;
}

export const CompanyTechnicians: React.FC<CompanyTechniciansProps> = ({ companyId }) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(false); // Hook placé ici, dans le composant

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(`/api/technicians/company/${companyId}`);
        setTechnicians(response.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des techniciens :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [companyId]);

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Techniciens ({loading ? "..." : technicians.length})
          </h3>
          <button
              className="btn-primary flex items-center gap-2"
              onClick={() => setShowForm(true)}
          >
            <Plus size={20} />
            Ajouter un technicien
          </button>
        </div>

        {showForm && (
            <TechnicianForm
                onSubmit={(data) => {
                  // Ici, on pourra envoyer les données à l'API et mettre à jour la liste des techniciens
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
            />
        )}

        {loading ? (
            <p className="text-center text-gray-500">Chargement des techniciens...</p>
        ) : technicians.length === 0 ? (
            <p className="text-center text-gray-500">Aucun technicien trouvé.</p>
        ) : (
            <div className="table-container">
              <table className="w-full">
                <thead>
                <tr>
                  <th className="table-header">Nom</th>
                  <th className="table-header">Spécialisation</th>
                  <th className="table-header">Contact</th>
                  <th className="table-header">Disponibilité</th>
                  <th className="table-header">Actions</th>
                </tr>
                </thead>
                <tbody>
                {technicians.map((tech) => (
                    <tr key={tech.id}>
                      <td className="table-cell font-medium">{tech.name}</td>
                      <td className="table-cell">{tech.specialization}</td>
                      <td className="table-cell">
                        <div>
                          <p>{tech.phone}</p>
                          <p className="text-sm text-gray-500">{tech.email}</p>
                        </div>
                      </td>
                      <td className="table-cell">
                    <span
                        className={`status-badge ${
                            tech.availability === "available"
                                ? "bg-green-100 text-green-800"
                                : tech.availability === "busy"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                        }`}
                    >
                      {tech.availability === "available"
                          ? "Disponible"
                          : tech.availability === "busy"
                              ? "Occupé"
                              : "Hors ligne"}
                    </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
                            <Edit size={18} />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
};
