import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface StatusUpdateProps {
  ticketId: string;
  currentStatus: 'open' | 'in-progress' | 'resolved';
  onUpdate: () => void;
}

export function StatusUpdate({ ticketId, currentStatus, onUpdate }: StatusUpdateProps) {
  const [status, setStatus] = useState(currentStatus);

  const statusOptions = [
    { value: 'open', label: 'Ouvert', icon: AlertCircle, color: 'text-blue-600' },
    { value: 'in-progress', label: 'En cours', icon: Clock, color: 'text-yellow-600' },
    { value: 'resolved', label: 'Résolu', icon: CheckCircle, color: 'text-green-600' }
  ];

  async function handleStatusUpdate() {
    const { error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating status:', error);
      return;
    }

    onUpdate();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => setStatus(option.value as typeof currentStatus)}
              className={`p-4 rounded-lg border ${
                status === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-6 w-6 mx-auto mb-2 ${option.color}`} />
              <span className="text-sm font-medium block text-center">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleStatusUpdate}
        disabled={status === currentStatus}
        className="w-full"
      >
        Mettre à jour le statut
      </Button>
    </div>
  );
}