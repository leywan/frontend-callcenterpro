import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({ 
  title, 
  message, 
  onConfirm, 
  onCancel 
}: DeleteConfirmationDialogProps) {
  return (
    <>
      <div className="modal-backdrop" />
      <div className="modal-container">
        <div className="modal-content max-w-md">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
            
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button 
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}