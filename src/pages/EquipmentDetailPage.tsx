import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Thermometer, 
  Calendar, 
  Wrench, 
  History, 
  AlertTriangle,
  FileText,
  MapPin,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Equipment } from '@/types';

const mockEquipment: Equipment = {
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
  maintenanceHistory: [
    {
      id: 'MH-001',
      date: '2024-01-15',
      type: 'preventive',
      description: 'Maintenance trimestrielle',
      technician: 'Jean Dupont',
      parts: ['Filtre', 'Huile compresseur'],
      duration: 2,
      cost: 450
    }
  ]
};

export function EquipmentDetailPage() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{mockEquipment.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              mockEquipment.status === 'operational' ? 'bg-green-100 text-green-800' :
              mockEquipment.status === 'maintenance-needed' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {mockEquipment.status === 'operational' ? 'Opérationnel' :
               mockEquipment.status === 'maintenance-needed' ? 'Maintenance requise' :
               'En panne'}
            </span>
          </div>
          <p className="text-gray-600">Équipement N° {mockEquipment.serialNumber}</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Wrench className="mr-2 h-4 w-4" />
            Planifier maintenance
          </Button>
          <Button variant="outline" className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Signaler un problème
          </Button>
          <Button className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Générer rapport
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Température actuelle</h3>
            <Thermometer className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {mockEquipment.temperature}°C
          </div>
          <div className="text-sm text-gray-600">
            Consigne: {mockEquipment.targetTemperature}°C
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Prochaine maintenance</h3>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-lg font-medium text-gray-900 mb-2">
            {new Date(mockEquipment.nextMaintenanceDate).toLocaleDateString('fr-FR')}
          </div>
          <div className="text-sm text-gray-600">
            Dernière: {new Date(mockEquipment.lastMaintenanceDate).toLocaleDateString('fr-FR')}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Localisation</h3>
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-lg font-medium text-gray-900 mb-2">
            {mockEquipment.location}
          </div>
          <div className="text-sm text-gray-600">
            Installation: {new Date(mockEquipment.installationDate).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Caractéristiques techniques</h3>
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Fabricant</p>
                <p className="font-medium">{mockEquipment.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Modèle</p>
                <p className="font-medium">{mockEquipment.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{mockEquipment.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">N° de série</p>
                <p className="font-medium">{mockEquipment.serialNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Historique des maintenances</h3>
            <History className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            {mockEquipment.maintenanceHistory.map((maintenance) => (
              <div key={maintenance.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{new Date(maintenance.date).toLocaleDateString('fr-FR')}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      maintenance.type === 'preventive' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {maintenance.type === 'preventive' ? 'Préventive' : 'Corrective'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{maintenance.duration}h</span>
                </div>
                <p className="text-sm text-gray-900 mb-2">{maintenance.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Technicien: {maintenance.technician}</span>
                  <span className="font-medium">{maintenance.cost}€</span>
                </div>
                {maintenance.parts.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Pièces remplacées:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {maintenance.parts.map((part, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}