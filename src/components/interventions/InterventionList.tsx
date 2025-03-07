import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, MapPin, Wrench, FileText, CheckCircle, XCircle } from 'lucide-react';
import type { Intervention, Technician, Client } from '../../types';

interface InterventionListProps {
  interventions: Intervention[];
  technicians: Technician[];
  clients: Client[];
  onSelect?: (intervention: Intervention) => void;
}

export const InterventionList: React.FC<InterventionListProps> = ({
  interventions,
  technicians,
  clients,
  onSelect
}) => {
  const getStatusColor = (status: Intervention['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'en-route':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getStatusText = (status: Intervention['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'en-route':
        return 'En route';
      case 'in-progress':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
    }
  };

  return (
    <div className="space-y-4">
      {interventions.map(intervention => {
        const technician = technicians.find(t => t.id === intervention.technicianId);
        const client = clients.find(c => c.id === intervention.incidentId.split('-')[0]);

        if (!technician || !client) return null;

        return (
          <div
            key={intervention.id}
            className="card hover:scale-[1.02] cursor-pointer transition-transform"
            onClick={() => onSelect?.(intervention)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {client.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Technicien: {technician.name}
                </p>
              </div>
              <span className={`status-badge ${getStatusColor(intervention.status)}`}>
                {getStatusText(intervention.status)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                <span>
                  {intervention.startTime
                    ? format(intervention.startTime, 'PPp', { locale: fr })
                    : 'Non démarré'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{client.address}</span>
              </div>

              {intervention.partsUsed.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Wrench className="h-4 w-4" />
                  <span>{intervention.partsUsed.length} pièces utilisées</span>
                </div>
              )}

              {intervention.notes && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FileText className="h-4 w-4" />
                  <span className="line-clamp-1">{intervention.notes}</span>
                </div>
              )}
            </div>

            {intervention.route && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Distance</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {(intervention.route.distance / 1000).toFixed(1)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Durée estimée</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {Math.round(intervention.route.duration / 60)} min
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};