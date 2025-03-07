import React from 'react';
import { Ticket, Clock, Users, AlertTriangle } from 'lucide-react';
import { Incident, Technician } from '../../types';

interface StatCardsProps {
  incidents: Incident[];
  availableTechnicians: Technician[];
}

export const StatCards: React.FC<StatCardsProps> = ({ incidents, availableTechnicians }) => {
  const currentDate = new Date();
  const last24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  
  const stats = {
    newTickets24h: incidents.filter(i => 
      i.status === 'new' && 
      i.timestamp > last24Hours
    ).length,
    
    criticalIncidents: incidents.filter(i => 
      i.status !== 'resolved' && 
      i.priority === 'high'
    ).length,
    
    avgResponseTime: incidents
      .filter(i => i.status === 'assigned')
      .reduce((acc, curr) => {
        const responseTime = curr.timestamp.getTime() - currentDate.getTime();
        return acc + responseTime;
      }, 0) / incidents.filter(i => i.status === 'assigned').length || 0,
    
    pendingAssignment: incidents.filter(i => 
      i.status === 'new'
    ).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="stat-card">
        <div className="flex items-center justify-between">
          <Ticket className="h-8 w-8 text-blue-600" />
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            24h
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-gray-600">Nouveaux Tickets</h3>
          <p className="text-2xl font-bold">{stats.newTickets24h}</p>
          <p className="text-sm text-gray-500 mt-1">dernières 24 heures</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
            Urgent
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-gray-600">Incidents Critiques</h3>
          <p className="text-2xl font-bold">{stats.criticalIncidents}</p>
          <p className="text-sm text-gray-500 mt-1">nécessitent attention immédiate</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <Clock className="h-8 w-8 text-yellow-600" />
          <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
            Temps
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-gray-600">Temps de Réponse Moyen</h3>
          <p className="text-2xl font-bold">
            {Math.round(stats.avgResponseTime / (1000 * 60))} min
          </p>
          <p className="text-sm text-gray-500 mt-1">pour les tickets assignés</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <Users className="h-8 w-8 text-green-600" />
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            En attente
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-gray-600">À Assigner</h3>
          <p className="text-2xl font-bold">{stats.pendingAssignment}</p>
          <p className="text-sm text-gray-500 mt-1">tickets non assignés</p>
        </div>
      </div>
    </div>
  );
};