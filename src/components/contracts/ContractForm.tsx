import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Contract } from '../../types';

interface ContractFormProps {
  initialData?: Partial<Contract>;
  onSubmit: (data: Partial<Contract>) => void;
  onCancel: () => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Contract>>({
    type: 'maintenance',
    status: 'pending',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    value: 0,
    paymentTerms: {
      frequency: 'monthly',
      amount: 0,
      dueDay: 1,
    },
    services: [],
    documents: [],
    renewalNotificationDays: 30,
    autoRenew: true,
    ...initialData,
  });

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    frequency: 'monthly' as Contract['services'][0]['frequency'],
  });

  const handleAddService = () => {
    if (newService.name && newService.description) {
      setFormData(prev => ({
        ...prev,
        services: [...(prev.services || []), newService],
      }));
      setNewService({
        name: '',
        description: '',
        frequency: 'monthly',
      });
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Type de contrat
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              type: e.target.value as Contract['type']
            }))}
            className="input-field"
            required
          >
            <option value="maintenance">Maintenance</option>
            <option value="service">Service</option>
            <option value="emergency">Urgence</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              status: e.target.value as Contract['status']
            }))}
            className="input-field"
            required
          >
            <option value="pending">En attente</option>
            <option value="active">Actif</option>
            <option value="expired">Expiré</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Date de début
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              startDate: e.target.value
            }))}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Date de fin
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              endDate: e.target.value
            }))}
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Valeur du contrat (€)
        </label>
        <input
          type="number"
          value={formData.value}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            value: parseFloat(e.target.value)
          }))}
          className="input-field"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-800 dark:text-white">Modalités de paiement</h4>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Fréquence
            </label>
            <select
              value={formData.paymentTerms?.frequency}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentTerms: {
                  ...prev.paymentTerms!,
                  frequency: e.target.value as Contract['paymentTerms']['frequency']
                }
              }))}
              className="input-field"
              required
            >
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
              <option value="annually">Annuel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Montant (€)
            </label>
            <input
              type="number"
              value={formData.paymentTerms?.amount}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentTerms: {
                  ...prev.paymentTerms!,
                  amount: parseFloat(e.target.value)
                }
              }))}
              className="input-field"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Jour d'échéance
            </label>
            <input
              type="number"
              value={formData.paymentTerms?.dueDay}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentTerms: {
                  ...prev.paymentTerms!,
                  dueDay: parseInt(e.target.value)
                }
              }))}
              className="input-field"
              required
              min="1"
              max="31"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-800 dark:text-white">Services inclus</h4>
        
        <div className="space-y-4">
          {formData.services?.map((service, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {service.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {service.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveService(index)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Nom du service"
                className="input-field"
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Description"
                className="input-field"
              />
            </div>
            <div>
              <select
                value={newService.frequency}
                onChange={(e) => setNewService(prev => ({
                  ...prev,
                  frequency: e.target.value as Contract['services'][0]['frequency']
                }))}
                className="input-field"
              >
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
                <option value="quarterly">Trimestriel</option>
                <option value="annually">Annuel</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddService}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Ajouter un service
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Jours de notification avant renouvellement
          </label>
          <input
            type="number"
            value={formData.renewalNotificationDays}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              renewalNotificationDays: parseInt(e.target.value)
            }))}
            className="input-field"
            required
            min="0"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoRenew}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                autoRenew: e.target.checked
              }))}
              className="rounded text-blue-600"
            />
            <span>Renouvellement automatique</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {initialData ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};