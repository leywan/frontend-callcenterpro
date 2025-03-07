import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'new',
    client: 'Auchan Vélizy',
    description: 'Nouveau ticket créé : Alarme température chambre froide négative',
    timestamp: new Date(2024, 2, 15, 14, 30),
  },
  {
    id: 2,
    type: 'progress',
    client: 'Carrefour Montesson',
    description: 'Intervention en cours : Maintenance préventive système de réfrigération',
    timestamp: new Date(2024, 2, 15, 13, 45),
  },
  {
    id: 3,
    type: 'resolved',
    client: 'Leclerc Conflans',
    description: 'Ticket résolu : Remplacement compresseur vitrine réfrigérée',
    timestamp: new Date(2024, 2, 15, 12, 15),
  },
];

const statusIcons = {
  new: AlertCircle,
  progress: Clock,
  resolved: CheckCircle,
};

const statusColors = {
  new: 'text-blue-600',
  progress: 'text-yellow-600',
  resolved: 'text-green-600',
};

export function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = statusIcons[activity.type];
          const color = statusColors[activity.type];
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`${color} mt-1`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.client}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(activity.timestamp, "d MMMM 'à' HH:mm", { locale: fr })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}