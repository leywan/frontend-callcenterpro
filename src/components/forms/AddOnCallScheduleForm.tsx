import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface OnCallTechnician {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AddOnCallScheduleFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddOnCallScheduleForm({ onClose, onSuccess }: AddOnCallScheduleFormProps) {
  const [technicians, setTechnicians] = useState<OnCallTechnician[]>([]);
  const [formData, setFormData] = useState({
    technicianId: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchTechnicians();
  }, []);

  async function fetchTechnicians() {
    const { data, error } = await supabase
      .from('on_call_technicians')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching technicians:', error);
      return;
    }

    setTechnicians(data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('on_call_schedule')
      .insert([{
        technician_id: formData.technicianId,
        start_date: formData.startDate,
        end_date: formData.endDate,
        notes: formData.notes
      }]);

    if (error) {
      console.error('Error adding on-call schedule:', error);
      return;
    }

    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="modal-backdrop" />
      <div className="modal-container">
        <div className="modal-content max-w-md">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">Planifier une astreinte</h2>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technicien
              </label>
              <select
                name="technicianId"
                value={formData.technicianId}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un technicien</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                Planifier l'astreinte
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}