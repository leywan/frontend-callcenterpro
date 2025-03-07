import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, ArrowUpRight, MapPin, Thermometer, Wrench, Building2, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Ticket } from '@/types';

interface TicketListProps {
  searchTerm?: string;
  filters?: {
    status: string;
    priority: string;
    dateRange: string;
    assignedTo: string;
  };
}

export function TicketList({ searchTerm = '', filters = { status: 'all', priority: 'all', dateRange: 'all', assignedTo: 'all' } }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, filters]);

  async function fetchTickets() {
    let query = supabase
      .from('tickets')
      .select(`
        *,
        technician:technician_id (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (searchTerm) {
      query = query.or(`client_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }

    if (filters.assignedTo !== 'all') {
      if (filters.assignedTo === 'unassigned') {
        query = query.is('technician_id', null);
      } else {
        query = query.eq('technician_id', filters.assignedTo);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tickets:', error);
      return;
    }

    setTickets(data);
    setLoading(false);
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-400">Chargement...</div>;
  }

  if (tickets.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Aucun ticket trouvé
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`mt-1 ${
                ticket.status === 'open' ? 'text-blue-500 dark:text-blue-400' :
                ticket.status === 'in-progress' ? 'text-yellow-500 dark:text-yellow-400' :
                'text-green-500 dark:text-green-400'
              }`}>
                {ticket.status === 'open' && <AlertCircle className="h-5 w-5" />}
                {ticket.status === 'in-progress' && <Clock className="h-5 w-5" />}
                {ticket.status === 'resolved' && <CheckCircle className="h-5 w-5" />}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ticket.client_name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    ticket.priority === 'low' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' :
                    ticket.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                    ticket.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-gray-600 dark:text-gray-300">{ticket.description}</p>
                
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {ticket.location}
                  </div>
                  
                  {ticket.temperature !== null && (
                    <div className="flex items-center">
                      <Thermometer className="h-4 w-4 mr-1" />
                      {ticket.temperature}°C
                    </div>
                  )}
                  
                  {ticket.equipment_type && (
                    <div className="flex items-center">
                      <Wrench className="h-4 w-4 mr-1" />
                      {ticket.equipment_type}
                    </div>
                  )}
                </div>

                {ticket.technician && (
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4 mr-1" />
                    Assigné à: {ticket.technician.name}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(parseISO(ticket.created_at), "d MMMM 'à' HH:mm", { locale: fr })}
              </span>
              <Link to={`/tickets/${ticket.id}`}>
                <Button variant="outline" size="sm" className="flex items-center">
                  Voir détails
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}