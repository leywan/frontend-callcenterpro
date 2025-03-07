import React from 'react';
import { X, Building2, User, AlertCircle, Clock } from 'lucide-react';
import { Incident } from '../../types';
import { getClientName, getCompanyName } from '../../utils/helpers';

interface IncidentDetailsModalProps {
  incident: Incident;
  onClose: () => void;
}

export const IncidentDetailsModal: React.FC<IncidentDetailsModalProps> = ({
  incident,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              Ticket #{incident.id.slice(-4)}
            </h2>
            <p className="modal-subtitle">
              Créé le {incident.timestamp.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="modal-body">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  <Building2 size={16} />
                  <span>Société</span>
                </div>
                <p className="text-gray-900 dark:text-white">{getCompanyName(incident.companyId)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  <User size={16} />
                  <span>Client</span>
                </div>
                <p className="text-gray-900 dark:text-white">{getClientName(incident.clientId)}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  <AlertCircle size={16} />
                  <span>Priorité</span>
                </div>
                <span className={`status-badge ${
                  incident.priority === 'high'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    : incident.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {incident.priority === 'high'
                    ? 'Haute'
                    : incident.priority === 'medium'
                    ? 'Moyenne'
                    : 'Basse'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  <Clock size={16} />
                  <span>Statut</span>
                </div>
                <span className={`status-badge ${
                  incident.status === 'new'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : incident.status === 'assigned'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {incident.status === 'new'
                    ? 'Nouveau'
                    : incident.status === 'assigned'
                    ? 'Assigné'
                    : 'Résolu'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description du problème</h3>
            <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              {incident.issue}
            </p>
          </div>

          {incident.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h3>
              <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 whitespace-pre-line">
                {incident.notes}
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-primary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};