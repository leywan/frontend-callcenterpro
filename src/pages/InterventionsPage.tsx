import React, { useState } from 'react';
import { Calendar, Filter, Plus, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Intervention {
  id: string;
  type: 'preventive' | 'corrective';
  status: 'planned' | 'in-progress' | 'completed';
  client: string;
  equipment: string;
  date: string;
  technician: string;
  duration: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
}

const mockInterventions: Intervention[] = [
  {
    id: 'INT-2024-001',
    type: 'preventive',
    status: 'planned',
    client: 'Carrefour Montesson',
    equipment: 'Chambre froide négative',
    date: '2024-03-25T09:00:00',
    technician: 'Jean Dupont',
    duration: '2h',
    priority: 'medium',
    description: 'Maintenance préventive trimestrielle'
  },
  {
    id: 'INT-2024-002',
    type: 'corrective',
    status: 'in-progress',
    client: 'Auchan Vélizy',
    equipment: 'Centrale de production',
    date: '2024-03-20T14:30:00',
    technician: 'Marie Martin',
    duration: '4h',
    priority: 'high',
    description: 'Remplacement compresseur défectueux'
  }
];

const statusColors = {
  planned: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800'
};

export function InterventionsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interventions techniques</h1>
          <p className="text-gray-600">Planification et suivi des interventions</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'list' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendrier
            </button>
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle intervention
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Équipement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technicien</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockInterventions.map((intervention) => (
                  <tr key={intervention.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{intervention.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{intervention.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{intervention.equipment}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {intervention.type === 'preventive' ? 'Préventive' : 'Corrective'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[intervention.status]}`}>
                        {intervention.status === 'planned' ? 'Planifiée' :
                         intervention.status === 'in-progress' ? 'En cours' : 'Terminée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(intervention.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{intervention.technician}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[intervention.priority]}`}>
                        {intervention.priority.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center text-gray-500">
            Vue calendrier en développement
          </div>
        </div>
      )}
    </div>
  );
}