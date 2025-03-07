import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { getTechnicians, createTechnician } from "../../services/api";
import { FormModal } from "../modals/FormModal";
import { TechnicianForm } from "../forms/TechnicianForm";
import type { Technician } from "../../types";

export const TechniciansSection: React.FC = () => {
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const data = await getTechnicians();
                setTechnicians(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des techniciens :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTechnicians();
    }, []);

    const handleAddTechnician = async (techData: Partial<Technician>) => {
        try {
            const newTech = await createTechnician(techData);
            setTechnicians((prev) => [...prev, newTech]);
            setShowAddModal(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout du technicien :", error);
        }
    };

    if (loading) {
        return <div className="text-center p-4">Chargement des techniciens...</div>;
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Techniciens
                </h2>
                <button
                    className="btn-primary flex items-center gap-2"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={20} />
                    Nouveau technicien
                </button>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Rechercher un technicien..."
                    className="search-field"
                />
            </div>

            {/* Liste des techniciens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technicians.length > 0 ? (
                    technicians.map((tech) => (
                        <div
                            key={tech.id}
                            className="card hover:scale-[1.02] cursor-pointer"
                        >
                            {/* En-tête de la carte : Nom + Badge de disponibilité */}
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    {tech.name}
                                </h3>
                                <span
                                    className={`status-badge ${
                                        tech.availability === "available"
                                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                            : tech.availability === "busy"
                                                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                    }`}
                                >
                  {tech.availability === "available"
                      ? "Disponible"
                      : tech.availability === "busy"
                          ? "Occupé"
                          : "Hors ligne"}
                </span>
                            </div>

                            {/* Corps de la carte : Spécialisation, téléphone, email */}
                            <div className="space-y-2 text-gray-600 dark:text-gray-300">
                                <p>{tech.specialization || "Spécialité non renseignée"}</p>
                                <p>{tech.phone || "Téléphone non renseigné"}</p>
                                <p className="text-sm">{tech.email || "Email non renseigné"}</p>
                            </div>

                            {/* Pied de la carte : Société et Statut (isOnDuty) */}
                            <div className="mt-4 pt-4 border-t dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Société</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {tech.companyId ? tech.companyId : "Société inconnue"}
                                </p>

                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Statut</p>
                                <p className="text-gray-800 dark:text-gray-200">
                                    {tech.isOnDuty ? "En service" : "Hors service"}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">
                        Aucun technicien trouvé.
                    </p>
                )}
            </div>

            {/* Modal : Ajouter un technicien */}
            {showAddModal && (
                <FormModal
                    title="Nouveau technicien"
                    onClose={() => setShowAddModal(false)}
                >
                    <TechnicianForm
                        onSubmit={handleAddTechnician}
                        onCancel={() => setShowAddModal(false)}
                    />
                </FormModal>
            )}
        </div>
    );
};

export default TechniciansSection;
