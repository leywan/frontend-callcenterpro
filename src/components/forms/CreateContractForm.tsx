import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreateContractFormProps {
  onClose: () => void;
}

export function CreateContractForm({ onClose }: CreateContractFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contract creation
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Nouveau contrat</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un client</option>
                <option value="CL-2024-001">Carrefour Montesson</option>
                <option value="CL-2024-002">Auchan Vélizy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de contrat
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="maintenance">Maintenance</option>
                <option value="installation">Installation</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valeur annuelle (€)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fréquence de maintenance
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="monthly">Mensuelle</option>
                <option value="quarterly">Trimestrielle</option>
                <option value="biannual">Semestrielle</option>
                <option value="annual">Annuelle</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Équipements couverts
            </label>
            <div className="border rounded-md p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="eq1" className="rounded border-gray-300" />
                <label htmlFor="eq1">Chambre Froide Négative 1</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="eq2" className="rounded border-gray-300" />
                <label htmlFor="eq2">Vitrine Réfrigérée Fruits & Légumes</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="eq3" className="rounded border-gray-300" />
                <label htmlFor="eq3">Centrale de Production 1</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conditions du contrat
            </label>
            <div className="border rounded-md p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="term1" className="rounded border-gray-300" />
                <label htmlFor="term1">Maintenance préventive</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="term2" className="rounded border-gray-300" />
                <label htmlFor="term2">Intervention d'urgence 24/7</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="term3" className="rounded border-gray-300" />
                <label htmlFor="term3">Pièces détachées incluses</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le contrat
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}