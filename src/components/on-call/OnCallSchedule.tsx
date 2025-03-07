import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { AddOnCallScheduleForm } from '@/components/forms/AddOnCallScheduleForm';

// ... (garder les interfaces)

export function OnCallSchedule() {
  // ... (garder les états et fonctions)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Planning d'astreinte</h2>
        <Button onClick={() => setShowAddForm(true)}>
          Planifier une astreinte
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {schedule.technician.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {schedule.technician.phone}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  schedule.status === 'scheduled' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {schedule.status === 'scheduled' ? 'Planifié' : 'En cours'}
                </span>
              </div>

              {/* ... (continuer avec le reste du composant en ajoutant les classes dark:) */}
            </div>
          ))}
        </div>
      </div>

      {showAddForm && (
        <AddOnCallScheduleForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchSchedules();
          }}
        />
      )}
    </div>
  );
}