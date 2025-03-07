import React from 'react';
import { Calendar, Clock, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const mockMaintenances = [
  {
    id: 'M-2024-001',
    client: 'Carrefour Montesson',
    type: 'Préventive',
    equipment: 'Centrale de production',
    date: new Date(2024, 2, 20, 9, 0),
    duration: '2h',
    technician: 'Jean Dupont'
  },
  {
    id: 'M-2024-002',
    client: 'Auchan Vélizy',
    type: 'Contrôle',
    equipment: 'Chambres froides',
    date: new Date(2024, 2, 21, 14, 30),
    duration: '3h',
    technician: 'Marie Martin'
  }
];

export function MaintenanceSchedule() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Planning maintenance</h3>
        <Calendar className="h-6 w-6 text-blue-500" />
      </div>
      <div className="space-y-4">
        {mockMaintenances.map((maintenance) => (
          <div key={maintenance.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 rounded-lg p-3">
              <Wrench className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{maintenance.client}</h4>
                <span className="text-sm text-gray-500">
                  {format(maintenance.date, "d MMMM 'à' HH'h'mm", { locale: fr })}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {maintenance.type} - {maintenance.equipment}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {maintenance.duration}
                </div>
                <div>
                  Technicien: {maintenance.technician}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}