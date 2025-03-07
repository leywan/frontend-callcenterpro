import React, { useState } from 'react';
import { Plus, Search, Contact as FileContract } from 'lucide-react';
import { Contract } from '../../types';
import { FormModal } from '../modals/FormModal';
import { ContractForm } from '../contracts/ContractForm';
import { ContractList } from '../contracts/ContractList';
import { ContractDetails } from '../contracts/ContractDetails';

// Données de test pour les contrats
const mockContracts: Contract[] = [
  {
    id: '1',
    companyId: '1',
    type: 'maintenance',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    value: 12000,
    paymentTerms: {
      frequency: 'monthly',
      amount: 1000,
      dueDay: 5,
    },
    services: [
      {
        name: 'Maintenance préventive',
        description: 'Inspection mensuelle des équipements frigorifiques',
        frequency: 'monthly',
        lastPerformed: '2024-02-01',
        nextDue: '2024-03-01',
      },
      {
        name: 'Nettoyage des condenseurs',
        description: 'Nettoyage trimestriel des condenseurs',
        frequency: 'quarterly',
        lastPerformed: '2024-01-15',
        nextDue: '2024-04-15',
      },
    ],
    documents: [
      {
        name: 'Contrat signé',
        url: '/contracts/1/signed.pdf',
        type: 'contract',
        date: '2024-01-01',
      },
    ],
    renewalNotificationDays: 30,
    autoRenew: true,
  },
];

export const ContractsSection = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddContract = (data: Partial<Contract>) => {
    console.log('Nouveau contrat:', data);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Contrats</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les contrats de maintenance et de service
          </p>
        </div>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          Nouveau contrat
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher un contrat..."
          className="search-field"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {selectedContract ? (
        <ContractDetails
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      ) : (
        <ContractList
          contracts={mockContracts}
          onSelect={setSelectedContract}
        />
      )}

      {showAddModal && (
        <FormModal
          title="Nouveau contrat"
          onClose={() => setShowAddModal(false)}
        >
          <ContractForm
            onSubmit={handleAddContract}
            onCancel={() => setShowAddModal(false)}
          />
        </FormModal>
      )}
    </div>
  );
};