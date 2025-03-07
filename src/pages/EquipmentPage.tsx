import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Equipment } from '@/types';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { CreateEquipmentForm } from '@/components/forms/CreateEquipmentForm';

const mockEquipments: Equipment[] = [
  {
    id: 'EQ-2024-001',
    name: 'Chambre Froide Négative 1',
    type: 'chambre-froide',
    serialNumber: 'CF-NEG-001',
    manufacturer: 'Carrier',
    model: 'CF-2000N',
    installationDate: '2023-06-15',
    lastMaintenanceDate: '2024-01-15',
    nextMaintenanceDate: '2024-04-15',
    temperature: -18.5,
    targetTemperature: -20,
    status: 'operational',
    location: 'Zone stockage principal',
    clientId: 'CL-2024-001',
    maintenanceHistory: []
  },
  {
    id: 'EQ-2024-002',
    name: 'Vitrine Réfrigérée Fruits & Légumes',
    type: 'vitrine',
    serialNumber: 'VR-FL-002',
    manufacturer: 'Daikin',
    model: 'VR-3000',
    installationDate: '2023-08-20',
    lastMaintenanceDate: '2024-02-01',
    nextMaintenanceDate: '2024-05-01',
    temperature: 4.2,
    targetTemperature: 4.0,
    status: 'maintenance-needed',
    location: 'Rayon fruits et légumes',
    clientId: 'CL-2024-002',
    maintenanceHistory: []
  },
  {
    id: 'EQ-2024-003',
    name: 'Centrale de Production 1',
    type: 'centrale',
    serialNumber: 'CP-001',
    manufacturer: 'Trane',
    model: 'CP-5000',
    installationDate: '2023-05-10',
    lastMaintenanceDate: '2024-02-15',
    nextMaintenanceDate: '2024-05-15',
    temperature: 2.1,
    targetTemperature: 2.0,
    status: 'failure',
    location: 'Local technique principal',
    clientId: 'CL-2024-001',
    maintenanceHistory: []
  }
];

export function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Equipment['status'] | 'all'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredEquipments = mockEquipments.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || equipment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des équipements</h1>
          <p className="text-gray-600">Suivi et maintenance du parc installé</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un équipement..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Equipment['status'] | 'all')}
          >
            <option value="all">Tous les statuts</option>
            <option value="operational">Opérationnel</option>
            <option value="maintenance-needed">Maintenance requise</option>
            <option value="failure">En panne</option>
          </select>

          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Plus de filtres
          </Button>
          
          <Button 
            className="flex items-center"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvel équipement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.map((equipment) => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
      </div>

      {showCreateForm && <CreateEquipmentForm onClose={() => setShowCreateForm(false)} />}
    </div>
  );
}