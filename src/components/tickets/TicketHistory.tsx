import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { History, AlertCircle, Clock, CheckCircle, User, MessageSquare, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface HistoryEvent {
  id: string;
  ticket_id: string;
  event_type: 'creation' | 'status_change' | 'assignment' | 'comment' | 'intervention';
  description: string;
  created_at: string;
  user_id: string;
  details?: {
    old_status?: string;
    new_status?: string;
    technician_name?: string;
    comment?: string;
    intervention_type?: string;
    duration?: string;
  };
}

interface TicketHistoryProps {
  ticketId: string;
}

export function TicketHistory({ ticketId }: TicketHistoryProps) {
  const [events, setEvents] = React.useState<HistoryEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchHistory();
  }, [ticketId]);

  async function fetchHistory() {
    const { data, error } = await supabase
      .from('ticket_history')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ticket history:', error);
      return;
    }

    setEvents(data);
    setLoading(false);
  }

  if (loading) {
    return <div className="text-center py-4">Chargement de l'historique...</div>;
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'creation':
        return AlertCircle;
      case 'status_change':
        return Clock;
      case 'assignment':
        return User;
      case 'comment':
        return MessageSquare;
      case 'intervention':
        return Wrench;
      default:
        return History;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'creation':
        return 'text-blue-600 bg-blue-100';
      case 'status_change':
        return 'text-yellow-600 bg-yellow-100';
      case 'assignment':
        return 'text-purple-600 bg-purple-100';
      case 'comment':
        return 'text-gray-600 bg-gray-100';
      case 'intervention':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const Icon = getEventIcon(event.event_type);
        const colorClass = getEventColor(event.event_type);

        return (
          <div key={event.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 rounded-full p-2 ${colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {event.description}
                </p>
                <span className="text-sm text-gray-500">
                  {format(parseISO(event.created_at), "d MMMM 'à' HH:mm", { locale: fr })}
                </span>
              </div>
              {event.details && (
                <div className="mt-1 text-sm text-gray-600">
                  {event.details.old_status && event.details.new_status && (
                    <p>
                      Statut modifié de{' '}
                      <span className="font-medium">{event.details.old_status}</span> à{' '}
                      <span className="font-medium">{event.details.new_status}</span>
                    </p>
                  )}
                  {event.details.technician_name && (
                    <p>
                      Assigné à <span className="font-medium">{event.details.technician_name}</span>
                    </p>
                  )}
                  {event.details.intervention_type && (
                    <p>
                      Type d'intervention : <span className="font-medium">{event.details.intervention_type}</span>
                      {event.details.duration && (
                        <span className="ml-2">({event.details.duration})</span>
                      )}
                    </p>
                  )}
                  {event.details.comment && (
                    <p className="mt-1 italic">{event.details.comment}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}