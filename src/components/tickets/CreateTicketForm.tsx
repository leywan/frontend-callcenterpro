import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button.tsx';
import axios from 'axios';

interface CreateTicketFormProps {
  onClose: () => void;
  onTicketCreated?: () => void;
}

export function CreateTicketForm({ onClose, onTicketCreated }: CreateTicketFormProps) {
  const [formData, setFormData] = useState({
    callerName: '',
    clientId: '',
    priority: 'MOYENNE',
    description: '',
    temperature: '',
    equipmentType: '',
    location: ''
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8080/tickets", {
        callerName: formData.callerName,
        clientId: parseInt(formData.clientId), // S'assurer que c'est bien un nombre
        priority: formData.priority.toUpperCase(), // Correspondance avec Enum Spring Boot
        description: formData.description,
        status: "OUVERT" // Statut par défaut
      });

      console.log("Ticket créé avec succès:", response.data);
      onTicketCreated?.();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error);
      setErrorMessage("Une erreur est survenue lors de la création du ticket.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Nouveau ticket d'intervention</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.callerName}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priorité
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500"
                required
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'équipement
              </label>
              <input
                type="text"
                name="equipmentType"
                value={formData.equipmentType}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Température actuelle
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  °C
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localisation
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description du problème
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}