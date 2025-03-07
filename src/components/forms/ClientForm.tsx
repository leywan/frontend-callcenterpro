import React, { useEffect, useState } from "react";
import { Client, Company } from "../../types";
import { getCompanies, getClientDetail } from "../../services/api";

interface ClientFormProps {
    initialData?: Partial<Client>;
    onSubmit: (data: Partial<Client>) => void;
    onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
                                                          initialData,
                                                          onSubmit,
                                                          onCancel,
                                                      }) => {
    const [formData, setFormData] = useState<Partial<Client>>({
        name: "",
        companyId: "",
        address: "",
        phone: "",
        email: "",
        equipmentDetails: "",
        status: "active",
        remoteAccess: [
            { type: "teamviewer", url: "", username: "", password: "" },
            { type: "danfoss", url: "", username: "", password: "" },
            { type: "akm", url: "", username: "", password: "" },
        ],
    });

    const [companies, setCompanies] = useState<Company[]>([]);

    // 🔹 1) Charger la liste des sociétés (pour le <select>)
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await getCompanies();
                setCompanies(data);
            } catch (error) {
                console.error("Erreur lors du chargement des sociétés :", error);
            }
        };
        fetchCompanies();
    }, []);

    // 🔹 2) Charger le détail complet du client si on édite (initialData.id)
    useEffect(() => {
        async function fetchClientDetails(clientId: number) {
            try {
                const fullClient = await getClientDetail(String(clientId));
                // ⚠️ getClientDetail doit renvoyer l'objet complet (remoteAccess inclus)
                setFormData((prev) => ({
                    ...prev,
                    ...fullClient,
                    // Si l'API renvoie "equipmentDetails" sous un autre nom, adaptez ici
                    equipmentDetails: fullClient.equipmentDetails ?? "",
                    remoteAccess: fullClient.remoteAccess ?? [],
                }));
            } catch (error) {
                console.error("Erreur lors de la récupération du détail du client :", error);
            }
        }

        // Si on a un clientId, on recharge depuis l'API pour avoir remoteAccess
        if (initialData?.id) {
            fetchClientDetails(initialData.id);
        } else {
            // Sinon, on initialise le formData avec initialData (partiel) + default
            setFormData((prev) => ({
                ...prev,
                ...initialData,
                remoteAccess: initialData?.remoteAccess ?? prev.remoteAccess,
            }));
        }
    }, [initialData]);

    // 🔹 Mise à jour dynamique des accès distants
    const handleRemoteAccessChange = (type: string, field: string, value: string) => {
        setFormData((prev) => {
            const remoteAccesses = prev.remoteAccess ?? [];
            const updatedRemoteAccess = remoteAccesses.map((access) =>
                access.type === type
                    ? { ...access, [field]: value, id: access.id || undefined }
                    : access
            );
            // Si l'accès n'existe pas, on l'ajoute
            if (!remoteAccesses.some((access) => access.type === type)) {
                updatedRemoteAccess.push({ type, [field]: value, id: undefined });
            }
            return { ...prev, remoteAccess: updatedRemoteAccess };
        });
    };

    // 🔹 3) Sélection automatique de la première société si companyId vide
    useEffect(() => {
        if (!formData.companyId && companies.length > 0) {
            setFormData((prev) => ({ ...prev, companyId: companies[0].id }));
        }
    }, [companies, formData.companyId]);

    // 🔹 4) Soumission du formulaire
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du client + Société */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Nom du client
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
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Société
                    </label>
                    <select
                        value={formData.companyId || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                companyId: e.target.value,
                            }))
                        }
                        className="input-field"
                        required
                    >
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Adresse */}
            <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Adresse
                </label>
                <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="input-field"
                    required
                />
            </div>

            {/* Téléphone + Email */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Téléphone
                    </label>
                    <input
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value || undefined,
                            }))
                        }
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                email: e.target.value || undefined,
                            }))
                        }
                        className="input-field"
                    />
                </div>
            </div>

            {/* Détails des équipements */}
            <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Détails des équipements
                </label>
                <textarea
                    value={formData.equipmentDetails || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            equipmentDetails: e.target.value || undefined,
                        }))
                    }
                    className="input-field"
                    rows={4}
                />
            </div>

            {/* Accès à distance */}
            <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Accès à distance
                </h4>

                {/* TeamViewer */}
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                    <h5 className="text-white font-medium mb-3">TeamViewer</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                ID
                            </label>
                            <input
                                type="text"
                                value={
                                    formData.remoteAccess?.find((a) => a.type === "teamviewer")
                                        ?.username || ""
                                }
                                onChange={(e) =>
                                    handleRemoteAccessChange("teamviewer", "username", e.target.value)
                                }
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={
                                    formData.remoteAccess?.find((a) => a.type === "teamviewer")
                                        ?.password || ""
                                }
                                onChange={(e) =>
                                    handleRemoteAccessChange("teamviewer", "password", e.target.value)
                                }
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Danfoss */}
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                    <h5 className="text-white font-medium mb-3">Danfoss</h5>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                URL
                            </label>
                            <input
                                type="url"
                                value={
                                    formData.remoteAccess?.find((a) => a.type === "danfoss")?.url ||
                                    ""
                                }
                                onChange={(e) =>
                                    handleRemoteAccessChange("danfoss", "url", e.target.value)
                                }
                                className="input-field"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Nom d'utilisateur
                                </label>
                                <input
                                    type="text"
                                    value={
                                        formData.remoteAccess?.find((a) => a.type === "danfoss")
                                            ?.username || ""
                                    }
                                    onChange={(e) =>
                                        handleRemoteAccessChange("danfoss", "username", e.target.value)
                                    }
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={
                                        formData.remoteAccess?.find((a) => a.type === "danfoss")
                                            ?.password || ""
                                    }
                                    onChange={(e) =>
                                        handleRemoteAccessChange("danfoss", "password", e.target.value)
                                    }
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* AKM */}
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h5 className="text-white font-medium mb-3">AKM</h5>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                URL
                            </label>
                            <input
                                type="url"
                                value={
                                    formData.remoteAccess?.find((a) => a.type === "akm")?.url || ""
                                }
                                onChange={(e) =>
                                    handleRemoteAccessChange("akm", "url", e.target.value)
                                }
                                className="input-field"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Nom d'utilisateur
                                </label>
                                <input
                                    type="text"
                                    value={
                                        formData.remoteAccess?.find((a) => a.type === "akm")
                                            ?.username || ""
                                    }
                                    onChange={(e) =>
                                        handleRemoteAccessChange("akm", "username", e.target.value)
                                    }
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={
                                        formData.remoteAccess?.find((a) => a.type === "akm")
                                            ?.password || ""
                                    }
                                    onChange={(e) =>
                                        handleRemoteAccessChange("akm", "password", e.target.value)
                                    }
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statut */}
            <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Statut
                </label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={formData.status === "active"}
                            onChange={() => setFormData((prev) => ({ ...prev, status: "active" }))}
                            className="text-blue-600"
                        />
                        <span>Actif</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={formData.status === "inactive"}
                            onChange={() => setFormData((prev) => ({ ...prev, status: "inactive" }))}
                            className="text-blue-600"
                        />
                        <span>Inactif</span>
                    </label>
                </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3">
                <button type="button" onClick={onCancel} className="btn-secondary">
                    Annuler
                </button>
                <button type="submit" className="btn-primary">
                    {initialData?.id ? "Mettre à jour" : "Créer"}
                </button>
            </div>
        </form>
    );
};

export default ClientForm;
