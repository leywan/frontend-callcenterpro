import React from 'react';
import { 
  Building2, 
  MapPin, 
  UserCircle, 
  Mail, 
  PhoneIcon, 
  Globe,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Company } from '../../types';

interface CompanyInfoProps {
  company: Company;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ company }) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h3 className="company-detail-header">
          <Building2 className="h-5 w-5 text-blue-600" />
          Informations générales
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Adresse</label>
            <p className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              {company.address}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Contact</label>
            <p className="font-medium flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-gray-400" />
              {company.contactPerson}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              {company.email}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Téléphone</label>
            <p className="font-medium flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-gray-400" />
              {company.phone}
            </p>
          </div>
          {company.website && (
            <div>
              <label className="text-sm text-gray-600">Site web</label>
              <p className="font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <a href={company.website} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:text-blue-800">
                  {company.website}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
      <div>
        <h3 className="company-detail-header">
          <Calendar className="h-5 w-5 text-blue-600" />
          Informations contractuelles
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Période du contrat</label>
            <p className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              {new Date(company.contractStartDate).toLocaleDateString('fr-FR')} - 
              {new Date(company.contractEndDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Horaires d'intervention</label>
            <p className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              {company.operatingHours.start} - {company.operatingHours.end}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Facturation</label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{company.billingInfo.name}</p>
              <p className="text-sm text-gray-600">{company.billingInfo.address}</p>
              <p className="text-sm text-gray-600">TVA: {company.billingInfo.vatNumber}</p>
            </div>
          </div>
        </div>
      </div>
      {company.notes && (
        <div className="col-span-2 mt-8">
          <h3 className="company-detail-header">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Notes
          </h3>
          <p className="text-gray-600 whitespace-pre-line">{company.notes}</p>
        </div>
      )}
    </div>
  );
};