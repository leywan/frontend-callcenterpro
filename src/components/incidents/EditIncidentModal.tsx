import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Incident } from '../../types';
import { getClientName } from '../../utils/helpers';

interface EditIncidentModalProps {
  incident: Incident;
  onSave: (updatedIncident: Incident) => void;
  onClose: () => void;
}

export const EditIncidentModal: React.FC<EditIncidentModalProps> = ({
  incident,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    issue: incident.issue,
    priority: incident.priority,
    status: incident.status,
    notes: incident.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...incident,
      ...formData,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Modifier le ticket #{incident.id.slice(-4)}
            </h2>
            <p className="text-gray-600">{getClientName(incident.clientId)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description du problème
            </label>
            <textarea
              value={formData.issue}
              onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
              className="input-field h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  priority: e.target.value as Incident['priority']
                }))}
                className="input-field"
              >
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  status: e.target.value as Incident['status']
                }))}
                className="input-field"
              >
                <option value="new">Nouveau</option>
                <option value="assigned">Assigné</option>
                <option value="resolved">Résolu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="input-field h-32"
              placeholder="Ajouter des notes supplémentaires..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};