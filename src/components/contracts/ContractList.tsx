import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, AlertTriangle, CheckCircle, Calendar, CreditCard, Clock } from 'lucide-react';
import type { Contract } from '../../types';

interface ContractListProps {
  contracts: Contract[];
  onSelect?: (contract: Contract) => void;
}

export const ContractList: React.FC<ContractListProps> = ({
  contracts,
  onSelect
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

  return (
    <div className="space-y-4">
      {contracts.map(contract => {
        const daysUntilExpiry = differenceInDays(new Date(contract.endDate), new Date());
        const isNearExpiry = daysUntilExpiry <= contract.renewalNotificationDays;

        return (
          <div
            key={contract.id}
            className="card hover:scale-[1.02] cursor-pointer transition-transform"
            onClick={() => onSelect?.(contract)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  contract.type === 'maintenance'
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : contract.type === 'service'
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  <FileText className={`h-6 w-6 ${
                    contract.type === 'maintenance'
                      ? 'text-blue-600 dark:text-blue-400'
                      : contract.type === 'service'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Contrat {getTypeText(contract.type)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    #{contract.id.slice(-8)}
                  </p>
                </div>
              </div>
              <span className={`status-badge ${getStatusColor(contract.status)}`}>
                {getStatusText(contract.status)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>
                  Du {format(new Date(contract.startDate), 'P', { locale: fr })} au{' '}
                  {format(new Date(contract.endDate), 'P', { locale: fr })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CreditCard className="h-4 w-4" />
                <span>
                  {getPaymentFrequencyText(contract.paymentTerms.frequency)} - {contract.paymentTerms.amount}€
                </span>
              </div>

              {contract.services.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>{contract.services.length} services inclus</span>
                </div>
              )}
            </div>

            {isNearExpiry && contract.status === 'active' && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    Expire dans {daysUntilExpiry} jours
                    {contract.autoRenew && ' (Renouvellement automatique)'}
                  </span>
                </div>
              </div>
            )}

            {contract.documents.length > 0 && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {contract.documents.length} documents
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};