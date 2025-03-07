import { Company, Client, Technician, Incident, Operator } from '../types';

export const companies: Company[] = [
  {
    id: '1',
    name: 'Froid Expert SARL',
    address: '123 Rue du Commerce, 75001 Paris',
    phone: '01 23 45 67 89',
    contactPerson: 'Jean Dupont',
    email: 'contact@froidexpert.fr',
    website: 'www.froidexpert.fr',
    status: 'active',
    contractStartDate: '2024-01-01',
    contractEndDate: '2024-12-31',
    billingInfo: {
      name: 'Froid Expert SARL',
      address: '123 Rue du Commerce, 75001 Paris',
      vatNumber: 'FR12345678901',
    },
    operatingHours: {
      start: '08:00',
      end: '18:00',
    },
    notes: 'Client premium avec contrat de maintenance prioritaire',
  },
];

export const clients: Client[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Supermarché Central',
    address: '45 Avenue des Champs, 75008 Paris',
    phone: '01 98 76 54 32',
    email: 'contact@supercentral.fr',
    equipmentDetails: '3 chambres froides, 5 vitrines réfrigérées',
    status: 'active',
    remoteAccess: {
      teamviewer: {
        id: '123 456 789',
        password: 'tv2024!'
      },
      danfoss: {
        url: 'https://supervisor.danfoss.com',
        username: 'supercentral',
        password: 'df2024!'
      },
      akm: {
        url: 'https://akm.danfoss.com',
        username: 'supercentral_akm',
        password: 'akm2024!'
      }
    }
  },
];

export const technicians: Technician[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Pierre Martin',
    phone: '06 12 34 56 78',
    email: 'p.martin@froidexpert.fr',
    specialization: 'Froid commercial',
    availability: 'available',
    isOnDuty: true,
  },
];

export const incidents: Incident[] = [
  {
    id: '1',
    companyId: '1',
    clientId: '1',
    issue: 'Panne chambre froide négative',
    priority: 'high',
    status: 'new',
    timestamp: new Date(),
    notes: 'Température en hausse rapide',
  },
];

export const operators: Operator[] = [
  {
    id: '1',
    name: 'Sophie Bernard',
    email: 's.bernard@callcenter.fr',
    phone: '06 11 22 33 44',
    role: 'admin',
    status: 'online',
    shift: 'morning',
    skills: ['Gestion de crise', 'Support technique', 'Formation'],
    performance: {
      ticketsHandled: 245,
      avgResponseTime: 3.5,
      satisfaction: 4.8,
    },
    lastActive: new Date(),
    preferences: {
      notifications: true,
      theme: 'dark',
      language: 'fr'
    },
    securitySettings: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date()
    }
  },
  {
    id: '2',
    name: 'Marc Dubois',
    email: 'm.dubois@callcenter.fr',
    phone: '06 22 33 44 55',
    role: 'operator',
    status: 'busy',
    shift: 'morning',
    skills: ['Support technique', 'Service client'],
    performance: {
      ticketsHandled: 189,
      avgResponseTime: 4.2,
      satisfaction: 4.5,
    },
    lastActive: new Date(),
    preferences: {
      notifications: true,
      theme: 'dark',
      language: 'fr'
    },
    securitySettings: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date()
    }
  },
  {
    id: '3',
    name: 'Julie Martin',
    email: 'j.martin@callcenter.fr',
    phone: '06 33 44 55 66',
    role: 'operator',
    status: 'offline',
    shift: 'afternoon',
    skills: ['Support technique', 'Gestion des réclamations'],
    performance: {
      ticketsHandled: 167,
      avgResponseTime: 3.8,
      satisfaction: 4.6,
    },
    lastActive: new Date(Date.now() - 3600000),
    preferences: {
      notifications: true,
      theme: 'dark',
      language: 'fr'
    },
    securitySettings: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date()
    }
  },
];