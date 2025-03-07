import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Technician {
  id: string;
  name: string;
  email: string;
  client_id: string;
}

interface TechnicianAssignmentProps {
  ticketId: string;
  currentTechnicianId?: string;
  onAssign: () => void;
}

export function TechnicianAssignment({ ticketId, currentTechnicianId, onAssign }: TechnicianAssignmentProps) {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>(currentTechnicianId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  async function fetchTechnicians() {
    // Récupérer les techniciens d'astreinte
    const { data: onCallTechs, error: onCallError } = await supabase
      .from('on_call_technicians')
      .select('*')
      .order('name');

    if (onCallError) {
      console.error('Error fetching on-call technicians:', onCallError);
      return;
    }

    // Récupérer les techniciens réguliers
    const { data: regularTechs, error: regularError } = await supabase
      .from('technicians')
      .select('*')
      .order('name');

    if (regularError) {
      console.error('Error fetching regular technicians:', regularError);
      return;
    }

    // Combiner les deux types de techniciens
    const allTechnicians = [
      ...regularTechs,
      ...onCallTechs.map(tech => ({
        ...tech,
        is_on_call: true
      }))
    ];

    setTechnicians(allTechnicians);
    setLoading(false);
  }

  async function handleAssign() {
    if (!selectedTechnician) return;

    const { error } = await supabase
      .from('tickets')
      .update({ technician_id: selectedTechnician })
      .eq('id', ticketId);

    if (error) {
      console.error('Error assigning technician:', error);
      return;
    }

    onAssign();
  }

  if (loading) {
    return <div className="text-center py-4">Chargement des techniciens...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sélectionner un technicien
        </label>
        <select
          value={selectedTechnician}
          onChange={(e) => setSelectedTechnician(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Sélectionner un technicien</option>
          <optgroup label="Techniciens réguliers">
            {technicians
              .filter(tech => !tech.is_on_call)
              .map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Techniciens d'astreinte">
            {technicians
              .filter(tech => tech.is_on_call)
              .map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} (Astreinte)
                </option>
              ))}
          </optgroup>
        </select>
      </div>

      <Button
        onClick={handleAssign}
        disabled={!selectedTechnician}
        className="w-full"
      >
        <User className="mr-2 h-4 w-4" />
        Assigner le technicien
      </Button>
    </div>
  );
}