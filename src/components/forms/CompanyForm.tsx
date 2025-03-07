import React from 'react';
import { Company } from '../../types';

interface CompanyFormProps {
  initialData?: Partial<Company>;
  onSubmit: (data: Partial<Company>) => void;
  onCancel: () => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState<Partial<Company>>({
    name: '',
    address: '',
    phone: '',
    contactPerson: '',
    email: '',
    website: '',
    status: 'active',
    contractStartDate: new Date().toISOString().split('T')[0],
    contractEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    billingInfo: {
      factName: '',
      factAddress: '',
      vatNumber: '',
    },
    operatingHours: {
      startTime: '08:00',
      endTime: '18:00',
    },
    notes: '',
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Nom de la société
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Company['status'] }))}
            className="input-field"
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Adresse
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="input-field"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Contact principal
          </label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="input-field"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Site web
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Période du contrat</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={formData.contractStartDate}
              onChange={(e) => setFormData(prev => ({ ...prev, contractStartDate: e.target.value }))}
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
              value={formData.contractEndDate}
              onChange={(e) => setFormData(prev => ({ ...prev, contractEndDate: e.target.value }))}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Horaires d'intervention</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Heure de début
            </label>
            <input
              type="time"
              value={formData.operatingHours?.startTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                operatingHours: { ...prev.operatingHours!, startTime: e.target.value }
              }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Heure de fin
            </label>
            <input
              type="time"
              value={formData.operatingHours?.endTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                operatingHours: { ...prev.operatingHours!, endTime: e.target.value }
              }))}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Informations de facturation</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Nom de facturation
            </label>
            <input
              type="text"
              value={formData.billingInfo?.factName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                billingInfo: { ...prev.billingInfo!, factName: e.target.value }
              }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Adresse de facturation
            </label>
            <input
              type="text"
              value={formData.billingInfo?.factAddress}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                billingInfo: { ...prev.billingInfo!, factAddress: e.target.value }
              }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Numéro de TVA
            </label>
            <input
              type="text"
              value={formData.billingInfo?.vatNumber}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                billingInfo: { ...prev.billingInfo!, vatNumber: e.target.value }
              }))}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="input-field"
          rows={4}
        />
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