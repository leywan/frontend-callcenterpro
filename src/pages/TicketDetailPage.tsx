import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Thermometer, 
  Wrench,
  MessageSquare,
  History,
  User
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Ticket } from '@/types';
import { TicketComments } from '@/components/tickets/TicketComments';
import { TechnicianAssignment } from '@/components/tickets/TechnicianAssignment';
import { StatusUpdate } from '@/components/tickets/StatusUpdate';
import { TicketHistory } from '@/components/tickets/TicketHistory';

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  async function fetchTicket() {
    if (!id) return;

    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        technician:technician_id (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching ticket:', error);
      return;
    }

    setTicket(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-8">
        <div className="text-center">Ticket non trouvé</div>
      </div>
    );
  }

  const statusIcon = {
    open: AlertCircle,
    'in-progress': Clock,
    resolved: CheckCircle
  }[ticket.status];

  const StatusIcon = statusIcon;

  const statusColors = {
    open: 'text-blue-600 bg-blue-50',
    'in-progress': 'text-yellow-600 bg-yellow-50',
    resolved: 'text-green-600 bg-green-50'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/tickets')}
        className="text-blue-600 hover:text-blue-800 mb-4"
      >
        ← Retour aux tickets
      </button>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${statusColors[ticket.status]}`}>
            <StatusIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket #{id?.substring(0, 8)}
            </h1>
            <p className="text-gray-600">
              Créé le {format(parseISO(ticket.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setShowStatusUpdate(!showStatusUpdate)}
          >
            Mettre à jour le statut
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Détails du ticket</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-900">{ticket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Client</h3>
                  <p className="text-gray-900">{ticket.client_name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Priorité</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Localisation</h3>
                  <div className="flex items-center text-gray-900">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {ticket.location}
                  </div>
                </div>

                {ticket.temperature !== undefined && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Température</h3>
                    <div className="flex items-center text-gray-900">
                      <Thermometer className="h-4 w-4 mr-1 text-gray-400" />
                      {ticket.temperature}°C
                    </div>
                  </div>
                )}

                {ticket.equipment_type && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Équipement</h3>
                    <div className="flex items-center text-gray-900">
                      <Wrench className="h-4 w-4 mr-1 text-gray-400" />
                      {ticket.equipment_type}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showStatusUpdate && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Mise à jour du statut</h2>
              <StatusUpdate
                ticketId={ticket.id}
                currentStatus={ticket.status}
                onUpdate={() => {
                  fetchTicket();
                  setShowStatusUpdate(false);
                }}
              />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Commentaires</h2>
            <TicketComments ticketId={ticket.id} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Assignation</h2>
            {ticket.technician ? (
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.technician.name}</p>
                    <p className="text-sm text-gray-500">{ticket.technician.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setShowAssignment(true)}
                >
                  Changer de technicien
                </Button>
              </div>
            ) : (
              <div>
                {showAssignment ? (
                  <TechnicianAssignment
                    ticketId={ticket.id}
                    onAssign={() => {
                      fetchTicket();
                      setShowAssignment(false);
                    }}
                  />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Aucun technicien assigné</p>
                    <Button
                      className="mt-2"
                      onClick={() => setShowAssignment(true)}
                    >
                      Assigner un technicien
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Historique</h2>
              <History className="h-5 w-5 text-gray-400" />
            </div>
            <TicketHistory ticketId={ticket.id} />
          </div>
        </div>
      </div>

      {showAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {ticket.technician ? 'Changer de technicien' : 'Assigner un technicien'}
              </h2>
              <TechnicianAssignment
                ticketId={ticket.id}
                currentTechnicianId={ticket.technician?.id}
                onAssign={() => {
                  fetchTicket();
                  setShowAssignment(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}