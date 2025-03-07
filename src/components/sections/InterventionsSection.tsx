import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { InterventionList } from '../interventions/InterventionList';
import { technicians, clients } from '../../data/mockData';
import type { Intervention } from '../../types';

// Données de test pour les interventions
const mockInterventions: Intervention[] = [
  {
    id: '1',
    incidentId: '1',
    technicianId: '1',
    status: 'en-route',
    startTime: new Date(),
    notes: 'En route vers le client',
    photos: [],
    partsUsed: [],
    route: {
      distance: 5200,
      duration: 900,
      path: []
    }
  }
];

export const InterventionsSection = () => {
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Interventions en cours</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Suivez en temps réel les interventions des techniciens
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-6">
            <div className="flex items-center gap-3 text-yellow-500">
              <AlertTriangle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Configuration requise</h3>
                <p className="text-sm mt-1">
                  Pour afficher la carte des interventions, veuillez configurer une clé API Google Maps valide dans le fichier .env :
                </p>
                <pre className="bg-gray-800 p-2 rounded mt-2 text-sm font-mono">
                  VITE_GOOGLE_MAPS_API_KEY=votre_clé_api
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div>
          <InterventionList
            interventions={mockInterventions}
            technicians={technicians}
            clients={clients}
          />
        </div>
      </div>
    </div>
  );
};