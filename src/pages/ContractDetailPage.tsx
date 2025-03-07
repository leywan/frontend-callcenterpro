import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Box,
  Users,
  ClipboardList,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContractDetail {
  id: string;
  clientId: string;
  clientName: string;
  type: 'maintenance' | 'installation' | 'monitoring';
  status: 'active' | 'pending' | 'expired';
  startDate: string;
  endDate: string;
  value: number;
  maintenanceFrequency: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  nextMaintenance: string;
  equipments: Array<{
    id: string;
    name: string;
    type: string;
    location: string;
  }>;
  terms: Array<{
    id: string;
    description: string;
    included: boolean;
  }>;
  history: Array<{
    id: string;
    date: string;
    type: 'maintenance' | 'intervention' | 'modification';
    description: string;
  }>;
}

const mockContractDetail: ContractDetail = {
  id: 'CTR-2024-001',
  clientId: 'CL-2024-001',
  clientName: 'Carrefour Montesson',
  type: 'maintenance',
  status: 'active',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  value: 12000,
  maintenanceFrequency: 'quarterly',
  nextMaintenance: '2024-04-15',
  equipments: [
    {
      id: 'EQ-2024-001',
      name: 'Chambre Froide Négative 1',
      type: 'Chambre froide',
      location: 'Zone stockage principal'
    },
    {
      id: 'EQ-2024-003',
      name: 'Centrale de Production 1',
      type: 'Centrale',
      location: 'Local technique principal'
    }
  ],
  terms: [
    {
      id: 'T1',
      description: 'Maintenance préventive trimestrielle',
      included: true
    },
    {
      id: 'T2',
      description: 'Intervention d\'urgence 24/7',
      included: true
    },
    {
      id: 'T3',
      description: 'Pièces détachées incluses',
      included: false
    }
  ],
  history: [
    {
      id: 'H1',
      date: '2024-03-15',
      type: 'maintenance',
      description: 'Maintenance trimestrielle effectuée'
    },
    {
      id: 'H2',
      date: '2024-02-20',
      type: 'intervention',
      description: 'Intervention urgente - Remplacement sonde température'
    }
  ]
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  expired: 'bg-red-100 text-red-800'
};

export function ContractDetailPage() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{mockContractDetail.clientName}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[mockContractDetail.status]}`}>
              {mockContractDetail.status.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600">Contrat N° {mockContractDetail.id}</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Planifier maintenance
          </Button>
          <Button variant="outline" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Générer facture
          </Button>
          <Button className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Contacts client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Valeur du contrat</h3>
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {mockContractDetail.value.toLocaleString('fr-FR')} €
          </div>
          <div className="text-sm text-gray-600">
            par an
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Durée</h3>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-lg font-medium text-gray-900 mb-2">
            {new Date(mockContractDetail.startDate).toLocaleDateString('fr-FR')} au {new Date(mockContractDetail.endDate).toLocaleDateString('fr-FR')}
          </div>
          <div className="text-sm text-gray-600">
            Fréquence: {mockContractDetail.maintenanceFrequency}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Équipements couverts</h3>
            <Box className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {mockContractDetail.equipments.length}
          </div>
          <div className="text-sm text-gray-600">
            équipements sous contrat
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Équipements couverts</h3>
            <Box className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            {mockContractDetail.equipments.map((equipment) => (
              <div key={equipment.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{equipment.name}</h4>
                  <p className="text-sm text-gray-500">{equipment.type}</p>
                  <p className="text-sm text-gray-500">{equipment.location}</p>
                </div>
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Conditions du contrat</h3>
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            
            <div className="space-y-3">
              {mockContractDetail.terms.map((term) => (
                <div key={term.id} className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full ${term.included ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-900">{term.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Historique</h3>
              <History className="h-6 w-6 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              {mockContractDetail.history.map((event) => (
                <div key={event.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${event.type === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'intervention' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}