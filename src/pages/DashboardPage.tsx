import React from 'react';
import { AlertCircle, Clock, CheckCircle, Thermometer } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TicketsByStatus } from '@/components/dashboard/TicketsByStatus';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { RecentTicketsTable } from '@/components/dashboard/RecentTicketsTable';
import { WeatherAlert } from '@/components/dashboard/WeatherAlert';
import { MaintenanceSchedule } from '@/components/dashboard/MaintenanceSchedule';
import { StockStatus } from '@/components/dashboard/StockStatus';

export function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Bienvenue sur COLDCHAIN Management System</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Tickets actifs"
          value={24}
          icon={AlertCircle}
          color="text-blue-600"
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Interventions en attente"
          value={8}
          icon={Clock}
          color="text-yellow-600"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Résolutions aujourd'hui"
          value={12}
          icon={CheckCircle}
          color="text-green-600"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Alertes température"
          value={3}
          icon={Thermometer}
          color="text-red-600"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="mb-8">
        <RecentTicketsTable limit={20} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <TicketsByStatus />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <WeatherAlert />
        </div>
        <div>
          <MaintenanceSchedule />
        </div>
        <div>
          <StockStatus />
        </div>
      </div>
    </div>
  );
}