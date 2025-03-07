import React from 'react';
import { Thermometer, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Equipment } from '@/types';

interface EquipmentCardProps {
  equipment: Equipment;
}

const statusColors = {
  'operational': 'text-green-600',
  'maintenance-needed': 'text-yellow-600',
  'failure': 'text-red-600'
};

const StatusIcon = ({ status }: { status: Equipment['status'] }) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className={`h-5 w-5 ${statusColors[status]}`} />;
    case 'maintenance-needed':
      return <Clock className={`h-5 w-5 ${statusColors[status]}`} />;
    case 'failure':
      return <AlertTriangle className={`h-5 w-5 ${statusColors[status]}`} />;
  }
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const temperatureDiff = Math.abs(equipment.temperature - equipment.targetTemperature);
  const isTemperatureWarning = temperatureDiff > 2;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <StatusIcon status={equipment.status} />
            <h3 className="text-lg font-semibold text-gray-900">{equipment.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">{equipment.serialNumber}</p>
        </div>
        <div className={`flex items-center space-x-1 ${isTemperatureWarning ? 'text-red-600' : 'text-green-600'}`}>
          <Thermometer className="h-5 w-5" />
          <span className="text-lg font-semibold">{equipment.temperature}°C</span>
          <span className="text-sm text-gray-500">/ {equipment.targetTemperature}°C</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Fabricant</p>
          <p className="font-medium">{equipment.manufacturer}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Modèle</p>
          <p className="font-medium">{equipment.model}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            Prochaine maintenance: {new Date(equipment.nextMaintenanceDate).toLocaleDateString('fr-FR')}
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
}