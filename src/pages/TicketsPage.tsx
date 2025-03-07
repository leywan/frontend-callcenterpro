import React, { useState } from 'react';
import { Plus, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TicketList } from '@/components/tickets/TicketList';
import { CreateTicketForm } from '@/components/tickets/CreateTicketForm';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { TicketStats } from '@/components/tickets/TicketStats';

export function TicketsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    dateRange: 'all',
    assignedTo: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets d'intervention</h1>
          <p className="text-gray-600">Gérez vos tickets d'intervention en temps réel</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un ticket..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtres avancés
          </Button>

          <Button 
            className="flex items-center"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau ticket
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <TicketStats />
      </div>

      {showFilters && (
        <div className="mb-6">
          <TicketFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <TicketList 
          searchTerm={searchTerm}
          filters={filters}
        />
      </div>

      {isCreateModalOpen && (
        <CreateTicketForm onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}