import React, { useState } from 'react';
import {
  Settings,
  Users,
  Shield,
  Bell,
  Database,
  Activity,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const auditLogs = [
  {
    id: '1',
    action: 'settings_change',
    entityType: 'settings',
    entityId: 'notifications',
    userId: '1',
    timestamp: new Date(),
    details: 'Modification des paramètres de notification',
    ipAddress: '192.168.1.1',
  },
  {
    id: '2',
    action: 'login',
    entityType: 'operator',
    entityId: '2',
    userId: '2',
    timestamp: new Date(Date.now() - 3600000),
    details: 'Connexion réussie',
    ipAddress: '192.168.1.2',
  },
];

const systemHealth = {
  status: 'healthy',
  lastCheck: new Date(),
  metrics: {
    cpu: 45,
    memory: 68,
    storage: 32,
    activeUsers: 12,
  },
};

export const AdminSection = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'audit'>('general');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Administration</h2>
          <p className="text-gray-500 dark:text-gray-400">Gérez les paramètres système et la sécurité</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('general')}
          className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
        >
          <Settings size={16} className="mr-2" />
          Général
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
        >
          <Shield size={16} className="mr-2" />
          Sécurité
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
        >
          <Activity size={16} className="mr-2" />
          Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau principal */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'general' && (
            <>
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-blue-600" />
                  Paramètres généraux
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Nom de l'application
                    </label>
                    <input
                      type="text"
                      defaultValue="CallCenter Pro"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Fuseau horaire par défaut
                    </label>
                    <select className="input-field">
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Langue par défaut
                    </label>
                    <select className="input-field">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <Bell size={20} className="text-blue-600" />
                  Paramètres de notification
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 dark:text-gray-300">
                      Notifications par email
                    </span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 dark:text-gray-300">
                      Notifications push
                    </span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 dark:text-gray-300">
                      Notifications sonores
                    </span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-blue-600" />
                  Politique de sécurité
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Durée de session maximale (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="120"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Tentatives de connexion maximales
                    </label>
                    <input
                      type="number"
                      defaultValue="5"
                      className="input-field"
                    />
                  </div>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 dark:text-gray-300">
                      2FA obligatoire pour les administrateurs
                    </span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <Database size={20} className="text-blue-600" />
                  Sauvegarde et restauration
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Dernière sauvegarde</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">20/02/2024 15:30</p>
                    </div>
                    <button className="btn-secondary">
                      Sauvegarder maintenant
                    </button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">Restauration</h4>
                    <div className="flex gap-2">
                      <select className="input-field flex-1">
                        <option value="">Sélectionner une sauvegarde</option>
                        <option value="1">20/02/2024 15:30</option>
                        <option value="2">19/02/2024 15:30</option>
                      </select>
                      <button className="btn-secondary">
                        Restaurer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'audit' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Activity size={20} className="text-blue-600" />
                  Journal d'audit
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-9 input-field py-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
                      <Activity size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {log.details}
                        </p>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        IP: {log.ipAddress}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              État du système
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {systemHealth.status === 'healthy' ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    Système opérationnel
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dernière vérification: {systemHealth.lastCheck.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">CPU</span>
                    <span className="text-gray-800 dark:text-white">{systemHealth.metrics.cpu}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${systemHealth.metrics.cpu}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Mémoire</span>
                    <span className="text-gray-800 dark:text-white">{systemHealth.metrics.memory}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${systemHealth.metrics.memory}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Stockage</span>
                    <span className="text-gray-800 dark:text-white">{systemHealth.metrics.storage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${systemHealth.metrics.storage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Utilisateurs actifs</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">
                    {systemHealth.metrics.activeUsers}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              Sessions actives
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    Sophie Bernard
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dernière activité: il y a 2 min
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    Marc Dubois
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dernière activité: il y a 15 min
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <XCircle size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    Julie Martin
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Déconnectée
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};