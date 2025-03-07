import { LatLngLiteral } from '@react-google-maps/api';

export type Company = {
  id: string;
  name: string;
  address: string;
  phone: string;
  contactPerson: string;
  email: string;
  website?: string;
  status: 'active' | 'inactive';
  contractStartDate: string;
  contractEndDate: string;
  billingInfo: {
    factName: string;
    factAddress: string;
    vatNumber: string;
  };
  operatingHours: {
    startTime: string;
    endTime: string;
  };
  notes?: string;
  location?: LatLngLiteral;
};

export type Client = {
  id: number;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
  companyId?: number;   // si tu gardes l’ID
  company?: Company;    // 🔥 on autorise la propriété "company"
  remoteAccess?: RemoteAccess[];
  equipmentDetails?: string;
  location?: LatLngLiteral;
};

export interface RemoteAccess {
  id: string;
  type: string; // "teamviewer", "danfoss", "akm"
  username?: string;
  password?: string;
  url?: string;
}

export type Technician = {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  email: string;
  specialization: string;
  availability: 'available' | 'busy' | 'offline';
  isOnDuty: boolean;
  location?: LatLngLiteral;
  currentIntervention?: string;
  skills: string[];
  certifications: {
    name: string;
    expiryDate: string;
  }[];
};

export type Intervention = {
  id: string;
  incidentId: string;
  technicianId: string;
  status: 'pending' | 'en-route' | 'in-progress' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  notes: string;
  photos: string[];
  signature?: string;
  partsUsed: {
    name: string;
    quantity: number;
    cost: number;
  }[];
  route?: {
    distance: number;
    duration: number;
    path: LatLngLiteral[];
  };
};

export type Contract = {
  id: string;
  companyId: string;
  type: 'maintenance' | 'service' | 'emergency';
  status: 'active' | 'pending' | 'expired';
  startDate: string;
  endDate: string;
  value: number;
  paymentTerms: {
    frequency: 'monthly' | 'quarterly' | 'annually';
    amount: number;
    dueDay: number;
  };
  services: {
    name: string;
    description: string;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    lastPerformed?: string;
    nextDue?: string;
  }[];
  documents: {
    name: string;
    url: string;
    type: 'contract' | 'invoice' | 'report';
    date: string;
  }[];
  renewalNotificationDays: number;
  autoRenew: boolean;
};

export type Incident = {
  id: string;
  companyId: string;
  clientId: string;
  issue: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'assigned' | 'resolved';
  timestamp: Date;
  notes?: string;
};

export type Operator = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'supervisor' | 'operator';
  status: 'online' | 'busy' | 'offline';
  shift: 'morning' | 'afternoon' | 'night';
  skills: string[];
  performance: {
    ticketsHandled: number;
    avgResponseTime: number;
    satisfaction: number;
  };
  lastActive: Date;
  avatar?: string;
  preferences: {
    notifications: boolean;
    theme: 'dark' | 'light';
    language: 'fr' | 'en';
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
  };
};

export type SystemSettings = {
  id: string;
  name: string;
  value: string;
  category: 'security' | 'notifications' | 'general' | 'customization';
  description: string;
  lastModified: Date;
  modifiedBy: string;
};

export type AuditLog = {
  id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'settings_change';
  entityType: 'operator' | 'client' | 'technician' | 'incident' | 'settings';
  entityId: string;
  userId: string;
  timestamp: Date;
  details: string;
  ipAddress: string;
};

export type OnCallShift = {
  id: string;
  companyId: string;
  technicianId: string;
  startDate: Date;
  endDate: Date;
  type: 'primary' | 'backup';
  status: 'scheduled' | 'active' | 'completed';
  notes?: string;
};

export type OnCallSchedule = {
  id: string;
  companyId: string;
  month: number;
  year: number;
  shifts: OnCallShift[];
};