import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  FileText,
  Calendar,
  CreditCard,
  Clock,
  AlertTriangle,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';
import type { Contract } from '../../types';

interface ContractDetailsProps {
  contract: Contract;
  onClose: () => void;
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({
  contract,
  onClose
}) => {
  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getStatusText = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'pending':
        return 'En attente';
      case 'expired':
        return 'Expiré';
    }
  };

  const getTypeText = (type: Contract['type']) => {
    switch (type) {
      case 'maintenance':
        return 'Maintenance';
      case 'service':
        return 'Service';
      case 'emergency':
        return 'Urgence';
    }
  };

  const getPaymentFrequencyText = (frequency: Contract['paymentTerms']['frequency']) => {
    switch (frequency) {
      case 'monthly':
        return 'Mensuel';
      case 'quarterly':
        return 'Trimestriel';
      case 'annually':
        return 'Annuel';
    }
  };

  const getServiceFrequencyText = (frequency: Contract['services'][0]['frequency']) => {
    switch (frequency) {
      case 'weekly':
        return 'Hebdomadaire';
      case 'monthly':
        return 'Mensuel';
      case 'quarterly':
        return 'Trimestriel';
      case 'annually':
        return 'Annuel';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Contrat {getTypeText(contract.type)}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            #{contract.id.slice(-8)}
          </p>
        </div>
        <span className={`status-badge ${getStatusColor(contract.status)}`}>
          {getStatusText(contract.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Informations générales
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Période</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  Du {format(new Date(contract.startDate), 'P', { locale: fr })} au{' '}
                  {format(new Date(contract.endDate), 'P', { locale: fr })}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Paiement</p>
              <div className="flex items-center gap-2 mt-1">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span>
                  {getPaymentFrequencyText(contract.paymentTerms.frequency)} - {contract.paymentTerms.amount}€
                  (Jour d'échéance: {contract.paymentTerms.dueDay})
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Renouvellement</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>
                  {contract.autoRenew ? 'Automatique' : 'Manuel'} - 
                  Notification {contract.renewalNotificationDays} jours avant
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Documents
          </h3>
          <div className="space-y-3">
            {contract.documents.map(doc => (
              <div
                key={doc.url}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {doc.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(doc.date), 'P', { locale: fr })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(doc.url, '_blank')}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Services inclus
        </h3>
        <div className="space-y-4">
          {contract.services.map((service, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {service.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {service.description}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {getServiceFrequencyText(service.frequency)}
                </span>
              </div>
              {service.lastPerformed && service.nextDue && (
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Dernière intervention</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {format(new Date(service.lastPerformed), 'P', { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Prochaine échéance</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {format(new Date(service.nextDue), 'P', { locale: fr })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="btn-secondary"
        >
          Fermer
        </button>
        <button className="btn-primary">
          Modifier
        </button>
      </div>
    </div>
  );
};