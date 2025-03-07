import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TechniciansTable } from '@/components/on-call/TechniciansTable';
import { OnCallSchedule } from '@/components/on-call/OnCallSchedule';
import { CreateTechnicianForm } from '@/components/forms/CreateTechnicianForm';

export function OnCallPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planning d'astreinte</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion des techniciens et des plannings d'astreinte</p>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            className="flex items-center"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau technicien
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TechniciansTable />
        </div>
        <div className="space-y-6">
          <OnCallSchedule />
        </div>
      </div>

      {showCreateForm && (
        <CreateTechnicianForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}