
import {Company, Client} from "../types";

export const getClientName = (clientId: string, clients: Client[]): string => {
  const client = clients.find(c => c.id === clientId);
  return client ? client.name : 'Client inconnu';
};

export const getCompanyName = (companyId: string | undefined, companies: Company[] = []): string => {
  if (!companyId) return "Société inconnue"; // ✅ Empêche les erreurs si l'ID est null/undefined

  const company = companies.find((c) => String(c.id) === companyId);
  return company ? company.name : "Société inconnue";
};



