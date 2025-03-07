import React, { useState } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import { OnCallShift, Company, Technician } from '../../types';
import { technicians } from '../../data/mockData';

interface OnCallScheduleProps {
  company: Company;
  shifts: OnCallShift[];
  onAddShift: (shift: Partial<OnCallShift>) => void;
}

export const OnCallSchedule: React.FC<OnCallScheduleProps> = ({
  company,
  shifts,
  onAddShift
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const companyTechnicians = technicians.filter(tech => tech.companyId === company.id);

  const getShiftsForDay = (date: Date) => {
    return shifts.filter(shift => {
      const shiftStart = new Date(shift.startDate);
      const shiftEnd = new Date(shift.endDate);
      return date >= shiftStart && date <= shiftEnd;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Planning des astreintes
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Nouvelle astreinte
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <h4 className="text-lg font-medium text-gray-800 dark:text-white">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h4>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {/* En-têtes des jours */}
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
          <div
            key={day}
            className="bg-gray-100 dark:bg-gray-800 p-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Cellules des jours */}
        {daysInMonth.map((date, index) => {
          const dayShifts = getShiftsForDay(date);
          const isCurrentDay = isToday(date);
          const isCurrentMonth = isSameMonth(date, currentDate);

          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDayClick(date)}
              className={`
                min-h-[120px] bg-white dark:bg-gray-800 p-2
                ${!isCurrentMonth ? 'opacity-50' : ''}
                ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`
                  text-sm font-medium
                  ${isCurrentDay ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
                `}>
                  {format(date, 'd')}
                </span>
                {dayShifts.length > 0 && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                    {dayShifts.length}
                  </span>
                )}
              </div>

              <div className="mt-2 space-y-1">
                {dayShifts.map((shift) => {
                  const tech = technicians.find(t => t.id === shift.technicianId);
                  return (
                    <div
                      key={shift.id}
                      className={`
                        text-xs p-1 rounded
                        ${shift.type === 'primary'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }
                      `}
                    >
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span className="truncate">{tech?.name}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={12} />
                        <span>
                          {format(new Date(shift.startDate), 'HH:mm')} - {format(new Date(shift.endDate), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal d'ajout d'astreinte */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouvelle astreinte</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Technicien</label>
                <select className="input-field">
                  {companyTechnicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date de début</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heure de début</label>
                  <input type="time" className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date de fin</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heure de fin</label>
                  <input type="time" className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type d'astreinte</label>
                <select className="input-field">
                  <option value="primary">Principale</option>
                  <option value="backup">Backup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea className="input-field" rows={3} />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};