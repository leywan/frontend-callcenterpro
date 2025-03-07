import React from 'react';
import { AlertCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const stats = [
  {
    label: 'Tickets ouverts',
    value: 24,
    icon: AlertCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: { value: 12, isPositive: false }
  },
  {
    label: 'En cours',
    value: 8,
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    trend: { value: 5, isPositive: true }
  },
  {
    label: 'Résolus aujourd\'hui',
    value: 12,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    trend: { value: 8, isPositive: true }
  },
  {
    label: 'Urgents',
    value: 3,
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    trend: { value: 2, isPositive: false }
  }
];

export function TicketStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
          {stat.trend && (
            <div className="mt-4 flex items-center">
              <span className={`text-sm ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend.isPositive ? '+' : '-'}{Math.abs(stat.trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs. hier</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}