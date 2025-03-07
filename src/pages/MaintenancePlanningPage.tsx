import React from 'react';
import { Calendar as CalendarIcon, Clock, Users, MapPin, Wrench } from 'lucide-react';

interface MaintenanceEvent {
  id: string;
  clientName: string;
  location: string;
  date: string;
  duration: string;
  type: 'preventive' | 'corrective';
  status: 'scheduled' | 'in-progress' | 'completed';
  technician: string;
  equipment: string;
  contractId: string;
}

const mockMaintenanceEvents: MaintenanceEvent[] = [
  {
    id: 'MAINT-2024-001',
    clientName: 'Carrefour Montesson',
    location: '23 Avenue Gabriel Péri, 78360 Montesson',
    date: '2024-04-15T09:00:00',
    duration: '2h',
    type: 'preventive',
    status: 'scheduled',
    technician: 'Jean Dupont',
    equipment: 'Chambre Froide Négative 1',
    contractId: 'CTR-2024-001'
  },
  {
    id: 'MAINT-2024-002',
    clientName: 'Auchan Vélizy',
    location: '2 Avenue de l\'Europe, 78140 Vélizy-Villacoublay',
    date: '2024-04-01T14:30:00',
    duration: '3h',
    type: 'preventive',
    status: 'scheduled',
    technician: 'Marie Martin',
    equipment: 'Vitrine Réfrigérée Fruits & Légumes',
    contractId: 'CTR-2024-002'
  }
];

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800'
};

export function MaintenancePlanningPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Planning des maintenances</h1>
        <p className="text-gray-600">Calendrier des interventions programmées</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockMaintenanceEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{event.clientName}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status]}`}>
                    {event.status === 'scheduled' ? 'Planifié' :
                     event.status === 'in-progress' ? 'En cours' : 'Terminé'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Intervention N° {event.id}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {event.duration}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Localisation</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Technicien</p>
                  <p className="font-medium">{event.technician}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Wrench className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Équipement</p>
                  <p className="font-medium">{event.equipment}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date et heure</p>
                  <p className="font-medium">
                    {new Date(event.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 border-t pt-4">
              <Button variant="outline" size="sm">
                Modifier
              </Button>
              <Button variant="outline" size="sm">
                Rapport d'intervention
              </Button>
              <Button size="sm">
                Démarrer l'intervention
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}