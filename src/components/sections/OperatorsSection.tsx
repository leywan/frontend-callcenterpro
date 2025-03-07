import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Star,
  Clock,
  BarChart,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { operators } from '../../data/mockData';
import type { Operator } from '../../types';
import { FormModal } from '../modals/FormModal';
import { OperatorForm } from '../forms/OperatorForm';

export const OperatorsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<Operator['role'] | 'all'>('all');
  const [filterShift, setFilterShift] = useState<Operator['shift'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<Operator['status'] | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

  const handleAddOperator = (data: Partial<Operator>) => {
    console.log('Nouvel opérateur:', data);
    setShowAddModal(false);
  };

  const handleEditOperator = (data: Partial<Operator>) => {
    console.log('Modification opérateur:', data);
    setEditingOperator(null);
  };

  const filteredOperators = operators.filter(operator => {
    const matchesSearch = operator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         operator.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || operator.role === filterRole;
    const matchesShift = filterShift === 'all' || operator.shift === filterShift;
    const matchesStatus = filterStatus === 'all' || operator.status === filterStatus;

    return matchesSearch && matchesRole && matchesShift && matchesStatus;
  });

  const getStatusIcon = (status: Operator['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Operator['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleColor = (role: Operator['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'operator':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Opérateurs</h2>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={20} />
          Nouvel opérateur
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un opérateur..."
            className="search-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <select
            className="input-field"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as Operator['role'] | 'all')}
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="supervisor">Superviseur</option>
            <option value="operator">Opérateur</option>
          </select>

          <select
            className="input-field"
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value as Operator['shift'] | 'all')}
          >
            <option value="all">Tous les shifts</option>
            <option value="morning">Matin</option>
            <option value="afternoon">Après-midi</option>
            <option value="night">Nuit</option>
          </select>

          <select
            className="input-field"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Operator['status'] | 'all')}
          >
            <option value="all">Tous les statuts</option>
            <option value="online">En ligne</option>
            <option value="busy">Occupé</option>
            <option value="offline">Hors ligne</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOperators.map((operator) => (
          <div key={operator.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                    {operator.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${
                    operator.status === 'online' ? 'bg-green-500' :
                    operator.status === 'busy' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {operator.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{operator.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setEditingOperator(operator)}
                >
                  <Edit size={16} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className={`status-badge ${getRoleColor(operator.role)}`}>
                  {operator.role === 'admin' ? 'Admin' :
                   operator.role === 'supervisor' ? 'Superviseur' : 'Opérateur'}
                </span>
              </div>
              <div>
                <span className={`status-badge ${getStatusColor(operator.status)}`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(operator.status)}
                    {operator.status === 'online' ? 'En ligne' :
                     operator.status === 'busy' ? 'Occupé' : 'Hors ligne'}
                  </span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock size={16} />
                <span>Shift: {
                  operator.shift === 'morning' ? 'Matin' :
                  operator.shift === 'afternoon' ? 'Après-midi' : 'Nuit'
                }</span>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Compétences</p>
                <div className="flex flex-wrap gap-2">
                  {operator.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <BarChart size={14} />
                    <span>Tickets</span>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {operator.performance.ticketsHandled}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={14} />
                    <span>Temps moy.</span>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {operator.performance.avgResponseTime}min
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Star size={14} />
                    <span>Satisfaction</span>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {operator.performance.satisfaction}/5
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <FormModal
          title="Nouvel opérateur"
          onClose={() => setShowAddModal(false)}
        >
          <OperatorForm
            onSubmit={handleAddOperator}
            onCancel={() => setShowAddModal(false)}
          />
        </FormModal>
      )}

      {editingOperator && (
        <FormModal
          title="Modifier l'opérateur"
          onClose={() => setEditingOperator(null)}
        >
          <OperatorForm
            initialData={editingOperator}
            onSubmit={handleEditOperator}
            onCancel={() => setEditingOperator(null)}
          />
        </FormModal>
      )}
    </div>
  );
};