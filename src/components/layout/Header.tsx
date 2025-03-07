import React from 'react';
import { Menu, Clock, UserCircle } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="bg-gray-800 shadow-sm border-b border-gray-700 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 text-gray-400" />
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-gray-300">
                {currentDate.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <span className="text-sm text-gray-400 mt-1">
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center gap-3 border-l border-gray-700 pl-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-300">Sophie Bernard</span>
              <span className="text-xs text-gray-400">Superviseur</span>
            </div>
            <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <UserCircle className="h-6 w-6 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};