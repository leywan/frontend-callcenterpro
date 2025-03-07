import React, { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Ticket {
  id: string;
  client: {
    name: string;
  };
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  timestamp: string;
  temperature: number | null;
  equipment_type: string | null;
  location: string;
  status: "open" | "in-progress" | "resolved";
  technician?: {
    name: string;
    email: string;
  };
}

interface RecentTicketsTableProps {
  limit?: number;
}

export function RecentTicketsTable({ limit = 20 }: RecentTicketsTableProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await axios.get("http://localhost:8080/api/tickets");
        setTickets(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des tickets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [limit]);

  if (loading) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">Chargement des tickets...</div>
        </div>
    );
  }

  if (tickets.length === 0) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center text-gray-500">Aucun ticket trouvé</div>
        </div>
    );
  }

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Derniers tickets ouverts
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priorité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Température
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Temps écoulé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />
                      {ticket.id.substring(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.client ? ticket.client.name : "Client inconnu"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                    {ticket.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}
                  >
                    {ticket.priority.toUpperCase()}
                  </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.temperature !== null ? `${ticket.temperature}°C` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDistanceToNow(parseISO(ticket.timestamp), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Voir
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
