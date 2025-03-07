import React from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Globe,
  Key,
  Clock,
  Star,
  BarChart
} from 'lucide-react';
import { operators } from '../../data/mockData';

const currentUser = operators.find(op => op.id === '1'); // Sophie Bernard

export const ProfileSection = () => {
  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mon Profil</h2>
          <p className="text-gray-500 dark:text-gray-400">Gérez vos informations personnelles et vos préférences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Informations personnelles
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="btn-secondary">
                  Modifier la photo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <span className="flex items-center gap-2">
                      <User size={16} />
                      Nom complet
                    </span>
                  </label>
                  <input
                    type="text"
                    value={currentUser.name}
                    className="input-field"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <span className="flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    className="input-field"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <span className="flex items-center gap-2">
                      <Phone size={16} />
                      Téléphone
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={currentUser.phone}
                    className="input-field"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <span className="flex items-center gap-2">
                      <Shield size={16} />
                      Rôle
                    </span>
                  </label>
                  <input
                    type="text"
                    value={currentUser.role === 'admin' ? 'Administrateur' : 
                           currentUser.role === 'supervisor' ? 'Superviseur' : 'Opérateur'}
                    className="input-field"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Statistiques de performance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-card">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tickets traités</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {currentUser.performance.ticketsHandled}
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Temps moyen</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {currentUser.performance.avgResponseTime}min
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {currentUser.performance.satisfaction}/5
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Préférences et sécurité */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Préférences
            </h3>

            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Bell size={16} />
                    Notifications
                  </span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <span className="flex items-center gap-2">
                    <Globe size={16} />
                    Langue
                  </span>
                </label>
                <select className="input-field">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Sécurité
            </h3>

            <div className="space-y-4">
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <Key size={16} />
                Changer le mot de passe
              </button>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Shield size={16} />
                  Authentification à deux facteurs
                </span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};