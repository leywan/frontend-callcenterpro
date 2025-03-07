import React from 'react';
import { 
  ChevronLeft, 
  Edit, 
  Building2,
  Users,
  UserCog,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Company } from '../../types';
import { CompanyInfo } from './CompanyInfo';
import { CompanyClients } from './CompanyClients';
import { CompanyTechnicians } from './CompanyTechnicians';
import { CompanyIncidents } from './CompanyIncidents';
import { OnCallSchedule } from './OnCallSchedule';

interface CompanyDetailsProps {
  company: Company;
  activeTab: 'info' | 'clients' | 'technicians' | 'incidents' | 'schedule';
  onBack: () => void;
  onTabChange: (tab: 'info' | 'clients' | 'technicians' | 'incidents' | 'schedule') => void;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  company,
  activeTab,
  onBack,
  onTabChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="btn-secondary"
          >
            <ChevronLeft size={20} />
            Retour
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{company.name}</h2>
          <span className={`status-badge ${
            company.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {company.status === 'active' ? 'Actif' : 'Inactif'}
          </span>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Edit size={20} />
          Modifier
        </button>
      </div>

      <div className="flex gap-4 border-b">
        <button
          onClick={() => onTabChange('info')}
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
        >
          <Building2 size={16} className="mr-2" />
          Informations
        </button>
        <button
          onClick={() => onTabChange('clients')}
          className={`tab-button ${activeTab === 'clients' ? 'active' : ''}`}
        >
          <Users size={16} className="mr-2" />
          Clients
        </button>
        <button
          onClick={() => onTabChange('technicians')}
          className={`tab-button ${activeTab === 'technicians' ? 'active' : ''}`}
        >
          <UserCog size={16} className="mr-2" />
          Techniciens
        </button>
        <button
          onClick={() => onTabChange('incidents')}
          className={`tab-button ${activeTab === 'incidents' ? 'active' : ''}`}
        >
          <AlertCircle size={16} className="mr-2" />
          Incidents
        </button>
        <button
          onClick={() => onTabChange('schedule')}
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
        >
          <Calendar size={16} className="mr-2" />
          Planning d'astreintes
        </button>
      </div>

      <div className="company-detail-section">
        {activeTab === 'info' && <CompanyInfo company={company} />}
        {activeTab === 'clients' && <CompanyClients companyId={company.id} />}
        {activeTab === 'technicians' && <CompanyTechnicians companyId={company.id} />}
        {activeTab === 'incidents' && <CompanyIncidents companyId={company.id} />}
        {activeTab === 'schedule' && (
          <OnCallSchedule
            company={company}
            shifts={[]}
            onAddShift={() => {}}
          />
        )}
      </div>
    </div>
  );
};