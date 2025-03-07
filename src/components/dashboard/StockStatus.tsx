import React from 'react';
import { Package, AlertTriangle, Check } from 'lucide-react';

const mockStockItems = [
  {
    name: 'Compresseur Scroll',
    reference: 'COMP-SCR-001',
    quantity: 2,
    minStock: 3,
    status: 'low'
  },
  {
    name: 'Détendeur thermostatique',
    reference: 'DET-TH-002',
    quantity: 5,
    minStock: 4,
    status: 'ok'
  },
  {
    name: 'Fluide R-449A',
    reference: 'FLU-449A',
    quantity: 1,
    minStock: 2,
    status: 'low'
  }
];

const statusColors = {
  low: 'text-red-600 bg-red-100',
  ok: 'text-green-600 bg-green-100'
};

const StatusIcon = ({ status }: { status: 'low' | 'ok' }) => {
  const Icon = status === 'low' ? AlertTriangle : Check;
  return <Icon className={`h-4 w-4 ${status === 'low' ? 'text-red-600' : 'text-green-600'}`} />;
};

export function StockStatus() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">État du stock</h3>
        <Package className="h-6 w-6 text-gray-500" />
      </div>
      <div className="space-y-4">
        {mockStockItems.map((item) => (
          <div key={item.reference} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center space-x-2">
                <StatusIcon status={item.status} />
                <h4 className="font-medium text-gray-900">{item.name}</h4>
              </div>
              <p className="text-sm text-gray-500 mt-1">Réf: {item.reference}</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColors[item.status]}`}>
                {item.quantity} / {item.minStock}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}