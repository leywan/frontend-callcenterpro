import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Incident, Technician } from '../../types';
import { getClientName } from '../../utils/helpers';

interface AssignTechnicianModalProps {
  incident: Incident;
  technicians: Technician[];
  onAssign: (technicianId: string) => void;
  onClose: () => void;
}

export const AssignTechnicianModal: React.FC<AssignTechnicianModalProps> = ({
  incident,
  technicians,
  onAssign,
  onClose,
}) => {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTechnicianId) {
      onAssign(selectedTechnicianId);
    }
  };

  const availableTechnicians = technicians.filter(tech => 
    tech.availability === 'available'
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Assigner un technicien
            </h2>
            <p className="text-gray-600">
              Ticket #{incident.id.slice(-4)} - {getClientName(incident.clientId)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un technicien
            </label>
            {availableTechnicians.length === 0 ? (
              <p className="text-red-600">Aucun technicien disponible actuellement</p>
            ) : (
              <div className="space-y-2">
                {availableTechnicians.map(tech => (
                  <label
                    key={tech.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTechnicianId === tech.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="technician"
                      value={tech.id}
                      checked={selectedTechnicianId === tech.id}
                      onChange={(e) => setSelectedTechnicianId(e.target.value)}
                      className="sr-only"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{tech.name}</p>
                      <p className="text-sm text-gray-500">{tech.specialization}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
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
              disabled={!selectedTechnicianId || availableTechnicians.length === 0}
            >
              Assigner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};