import React from 'react';
import { X } from 'lucide-react';

interface FormModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="relative min-h-[calc(100vh-2rem)] flex items-center py-8">
        <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl border border-gray-700">
          <div className="flex justify-between items-center p-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="p-8 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};