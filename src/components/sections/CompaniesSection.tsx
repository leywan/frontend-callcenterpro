import React, { useState } from 'react';
import { Plus, Search, Building2, Phone, Mail, Calendar } from 'lucide-react';
import { createCompany, updateCompany } from '../../services/api';
import { Company } from '../../types';
import { FormModal } from '../modals/FormModal';
import { CompanyForm } from '../forms/CompanyForm';
import { CompanyDetails } from '../companies/CompanyDetails';
import { useNotifications } from '../../hooks/useNotifications';


interface CompaniesSectionProps {
  companies: Company[]; // On reçoit la liste des entreprises via props
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
}

export const CompaniesSection: React.FC<CompaniesSectionProps> = ({ companies, setCompanies }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeCompanyTab, setActiveCompanyTab] = useState<'info' | 'clients' | 'technicians' | 'incidents' | 'schedule'>('info');
  const [searchQuery, setSearchQuery] = useState('');
  const { addNotification } = useNotifications();



  const handleAddCompany = async (data: Partial<Company>) => {
    try {
      const savedCompany = await createCompany(data); // <-- appel API
      console.log('Nouvelle permanence créée en base:', savedCompany);
      // Tu peux aussi mettre à jour la liste ou recharger
      setShowAddModal(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleEditCompany = async (data: Partial<Company>) => {
    if (!editingCompany) return;

    try {
      const updatedCompany = await updateCompany(editingCompany.id, data);

      // ✅ Mise à jour instantanée du state
      setCompanies(prevCompanies =>
          prevCompanies.map(company =>
              company.id === updatedCompany.id ? updatedCompany : company
          )
      );

      // ✅ Affichage d'une notification
      addNotification('success', 'Permanence mise à jour avec succès ✅');

      setEditingCompany(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // On filtre le tableau "companies" reçu en props
  const filteredCompanies = companies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedCompany) {
    return (
        <CompanyDetails
            company={selectedCompany}
            activeTab={activeCompanyTab}
            onBack={() => setSelectedCompany(null)}
            onTabChange={setActiveCompanyTab}
        />
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Permanences</h2>
          <button
              className="btn-primary flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Nouvelle permanence
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
              type="text"
              placeholder="Rechercher une permanence..."
              className="search-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Liste des permanences */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
              <div
                  key={company.id}
                  className="card hover:scale-[1.02] cursor-pointer"
                  onClick={() => setSelectedCompany(company)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {company.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {company.contactPerson}
                      </p>
                    </div>
                  </div>
                  <span className={`status-badge ${
                      company.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                {company.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{company.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{company.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                  {new Date(company.contractStartDate).toLocaleDateString('fr-FR')} -
                      {new Date(company.contractEndDate).toLocaleDateString('fr-FR')}
                </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Horaires</p>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {company.operatingHours.startTime} - {company.operatingHours.endTime}
                      </p>
                    </div>
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCompany(company);
                        }}
                        className="btn-secondary"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {showAddModal && (
            <FormModal
                title="Nouvelle permanence"
                onClose={() => setShowAddModal(false)}
            >
              <CompanyForm
                  onSubmit={handleAddCompany}
                  onCancel={() => setShowAddModal(false)}
              />
            </FormModal>
        )}

        {editingCompany && (
            <FormModal
                title="Modifier la permanence"
                onClose={() => setEditingCompany(null)}
            >
              <CompanyForm
                  initialData={editingCompany}
                  onSubmit={handleEditCompany}
                  onCancel={() => setEditingCompany(null)}
              />
            </FormModal>
        )}
      </div>
  );
};
