import React from 'react';
import { Button } from '@/components/ui/button';

interface TicketFiltersProps {
  filters: {
    status: string;
    priority: string;
    dateRange: string;
    assignedTo: string;
  };
  onFilterChange: (filters: TicketFiltersProps['filters']) => void;
}

export function TicketFilters({ filters, onFilterChange }: TicketFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Filtres avancés</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in-progress">En cours</option>
            <option value="resolved">Résolu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priorité
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500"
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
          >
            <option value="all">Toutes les priorités</option>
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Période
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500"
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigné à
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500"
            value={filters.assignedTo}
            onChange={(e) => onFilterChange({ ...filters, assignedTo: e.target.value })}
          >
            <option value="all">Tous les techniciens</option>
            <option value="unassigned">Non assigné</option>
            <option value="tech1">Jean Dupont</option>
            <option value="tech2">Marie Martin</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-4">
        <Button 
          variant="outline"
          onClick={() => onFilterChange({
            status: 'all',
            priority: 'all',
            dateRange: 'all',
            assignedTo: 'all'
          })}
        >
          Réinitialiser
        </Button>
        <Button>
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
}