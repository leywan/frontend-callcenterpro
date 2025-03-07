import React from 'react';
import { Operator } from '../../types';

interface OperatorFormProps {
  initialData?: Partial<Operator>;
  onSubmit: (data: Partial<Operator>) => void;
  onCancel: () => void;
}

export const OperatorForm: React.FC<OperatorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState<Partial<Operator>>({
    name: '',
    email: '',
    phone: '',
    role: 'operator',
    status: 'online',
    shift: 'morning',
    skills: [],
    performance: {
      ticketsHandled: 0,
      avgResponseTime: 0,
      satisfaction: 0,
    },
    preferences: {
      notifications: true,
      theme: 'dark',
      language: 'fr',
    },
    securitySettings: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date(),
    },
    ...initialData,
  });

  const [newSkill, setNewSkill] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skill),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Nom de l'opérateur
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Rôle
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as Operator['role'] }))}
            className="input-field"
          >
            <option value="operator">Opérateur</option>
            <option value="supervisor">Superviseur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="input-field"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Shift
          </label>
          <select
            value={formData.shift}
            onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value as Operator['shift'] }))}
            className="input-field"
          >
            <option value="morning">Matin</option>
            <option value="afternoon">Après-midi</option>
            <option value="night">Nuit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Operator['status'] }))}
            className="input-field"
          >
            <option value="online">En ligne</option>
            <option value="busy">Occupé</option>
            <option value="offline">Hors ligne</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Compétences
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="input-field flex-1"
            placeholder="Ajouter une compétence..."
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="btn-secondary"
          >
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.skills?.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-blue-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Préférences</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.preferences?.notifications}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences!, notifications: e.target.checked }
              }))}
              className="rounded text-blue-600"
            />
            <span>Notifications</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Thème
            </label>
            <select
              value={formData.preferences?.theme}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences!, theme: e.target.value as 'dark' | 'light' }
              }))}
              className="input-field"
            >
              <option value="dark">Sombre</option>
              <option value="light">Clair</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Langue
            </label>
            <select
              value={formData.preferences?.language}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences!, language: e.target.value as 'fr' | 'en' }
              }))}
              className="input-field"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Sécurité</h4>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.securitySettings?.twoFactorEnabled}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              securitySettings: { ...prev.securitySettings!, twoFactorEnabled: e.target.checked }
            }))}
            className="rounded text-blue-600"
          />
          <span>Authentification à deux facteurs</span>
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {initialData ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};