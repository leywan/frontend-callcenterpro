import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  backup_phone: string | null;
  emergency_contact: string | null;
  availability_zones: string[] | null;
  specialties: string[] | null;
  notes: string | null;
  client: {
    id: string;
    name: string;
  };
  schedules?: {
    start_date: string;
    end_date: string;
    status: string;
  }[];
}

export function TechniciansTable() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTechnicians();
  }, []);

  async function fetchTechnicians() {
    const now = new Date().toISOString();

    // Récupérer d'abord les techniciens
    const { data: techData, error: techError } = await supabase
      .from('on_call_technicians')
      .select(`
        *,
        client:client_id (
          id,
          name
        )
      `)
      .order('name');

    if (techError) {
      console.error('Error fetching technicians:', techError);
      return;
    }

    // Pour chaque technicien, récupérer son planning d'astreinte actuel
    const techsWithSchedules = await Promise.all(
      techData.map(async (tech) => {
        const { data: schedules, error: schedError } = await supabase
          .from('on_call_schedule')
          .select('*')
          .eq('technician_id', tech.id)
          .eq('status', 'scheduled')
          .gte('end_date', now)
          .order('start_date')
          .limit(1);

        if (schedError) {
          console.error('Error fetching schedule for technician:', schedError);
          return tech;
        }

        return {
          ...tech,
          schedules: schedules
        };
      })
    );

    setTechnicians(techsWithSchedules);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('on_call_technicians')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting technician:', error);
      return;
    }

    fetchTechnicians();
  };

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Chargement des techniciens...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un technicien..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technicien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Société
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spécialités
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Astreinte en cours
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTechnicians.map((tech) => (
              <tr key={tech.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                  {tech.emergency_contact && (
                    <div className="text-sm text-gray-500">
                      Contact urgence: {tech.emergency_contact}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{tech.client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {tech.phone}
                    </div>
                    {tech.backup_phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {tech.backup_phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      {tech.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {tech.specialties && tech.specialties.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tech.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {tech.availability_zones && tech.availability_zones.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tech.availability_zones.map((zone, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {zone}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {tech.schedules && tech.schedules[0] ? (
                    <div className="text-sm text-gray-900">
                      <div>
                        Du {format(new Date(tech.schedules[0].start_date), 'Pp', { locale: fr })}
                      </div>
                      <div>
                        Au {format(new Date(tech.schedules[0].end_date), 'Pp', { locale: fr })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Pas d'astreinte en cours</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(tech.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}