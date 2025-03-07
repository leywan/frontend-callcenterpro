import axios from "axios";
import {Client, Company, Technician} from "../types";

const API_BASE_URL = "http://localhost:8080/api"; // Base URL du backend Spring Boot

// Exemple : Récupérer un client détaillé (avec remoteAccess)
export async function getClientDetail(clientId: string) {
    const response = await axios.get(`${API_BASE_URL}/clients/${clientId}`);
    return response.data; // Suppose qu'il renvoie un DTO détaillé (ClientDetailDTO)
}


export const getClients = async (
    companyId: number | null,
    page = 0,
    size = 20
): Promise<{ content: Client[]; totalElements: number }> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/clients`, {
            params: {
                companyId, // peut être null
                page,
                size,
            },
        });
        return response.data; // on suppose { content: Client[], totalElements: number }
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des clients :", error);
        return { content: [], totalElements: 0 };
    }
};

export const createClient = async (newClient: Partial<Client>) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/clients`, {
            ...newClient,
            remoteAccess: newClient.remoteAccess?.map(access => ({
                ...access,
                id: access.id || undefined, // ✅ Assure que l'ID est présent si existant
            })) || []
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du client :", error);
    }
};

export const updateClient = async (clientId: string, updatedClient: Partial<Client>) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/clients/${clientId}`, {
            ...updatedClient,
            remoteAccess: updatedClient.remoteAccess?.map(access => ({
                ...access,
                id: access.id || undefined, // ✅ Assure que l'ID est conservé
            })) || []
        });
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du client :", error);
    }
};

export const deleteClient = async (clientId: string) => {
    try {
        await axios.delete(`${API_BASE_URL}/clients/${clientId}`);
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du client :", error);
    }
};


export const getTechnicians = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/technicians`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des techniciens :", error);
        return [];
    }
};

// Créer un technicien (ajoutez cette fonction)
export const createTechnician = async (newTechnician: Partial<Technician>) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/technicians`, newTechnician, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du technicien :", error);
        throw error;
    }
};

export const getCompanies = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/companies`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des permanences :", error);
        return [];
    }
};

export const getIncidents = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/incidents`);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des incidents:", error);
        return [];
    }
};

export const createCompany = async (newCompany: Partial<Company>) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/companies`, newCompany, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
    }
};


export const updateCompany = async (companyId: string, updatedCompany: Partial<Company>) => {
    const response = await axios.put(`${API_BASE_URL}/companies/${companyId}`, updatedCompany);
    return response.data;
};

export const searchClients = async (query: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/clients/search`, {
            params: { query }
        });
        return response.data; // un tableau de Client
    } catch (error) {
        console.error("❌ Erreur lors de la recherche de clients :", error);
        return [];
    }
};

