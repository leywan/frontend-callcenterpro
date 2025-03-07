import React from 'react';
import { Bell, MessageSquare, Star, Clock } from 'lucide-react';
import { InterventionTimeline } from './InterventionTimeline';
import { ClientChat } from './ClientChat';
import { FeedbackForm } from './FeedbackForm';
import { NotificationPreferences } from './NotificationPreferences';

interface ClientPortalProps {
  clientId: string;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ clientId }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Portail Client</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Suivez vos interventions et communiquez avec notre équipe
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Bell size={20} />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <MessageSquare size={20} />
            Support technique
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interventions en cours */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Interventions en cours
              </h3>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                2 en cours
              </span>
            </div>
            <InterventionTimeline clientId={clientId} />
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Support technique
              </h3>
            </div>
            <ClientChat clientId={clientId} />
          </div>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                Votre avis compte
              </h3>
            </div>
            <FeedbackForm clientId={clientId} />
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Notifications
              </h3>
            </div>
            <NotificationPreferences clientId={clientId} />
          </div>
        </div>
      </div>
    </div>
  );
};