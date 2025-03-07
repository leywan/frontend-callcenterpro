import React from 'react';
import { CheckCircle, Clock, MapPin, Wrench } from 'lucide-react';

interface InterventionTimelineProps {
  clientId: string;
}

export const InterventionTimeline: React.FC<InterventionTimelineProps> = () => {
  return (
    <div className="space-y-8">
      <div className="relative pl-8 pb-8 border-l-2 border-blue-500">
        <div className="absolute -left-2 top-0">
          <div className="bg-blue-500 p-1.5 rounded-full">
            <Clock className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-blue-600 dark:text-blue-400">
              Intervention #4789 en cours
            </h4>
            <span className="text-sm text-gray-500">Il y a 10 min</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Le technicien Pierre Martin est en route
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>Temps d'arrivée estimé : 15 minutes</span>
          </div>
        </div>
      </div>

      <div className="relative pl-8 pb-8 border-l-2 border-green-500">
        <div className="absolute -left-2 top-0">
          <div className="bg-green-500 p-1.5 rounded-full">
            <Wrench className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-green-600 dark:text-green-400">
              Maintenance préventive planifiée
            </h4>
            <span className="text-sm text-gray-500">Aujourd'hui 14:30</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Inspection trimestrielle des équipements
          </p>
        </div>
      </div>

      <div className="relative pl-8">
        <div className="absolute -left-2 top-0">
          <div className="bg-gray-500 p-1.5 rounded-full">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              Intervention #4788 terminée
            </h4>
            <span className="text-sm text-gray-500">Hier</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Remplacement du thermostat défectueux
          </p>
          <button className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Voir le rapport d'intervention
          </button>
        </div>
      </div>
    </div>
  );
};