import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button.tsx';
import { updateClient} from "../../services/api.ts";

interface EditClientFormProps {
  client: any;
  onClose: () => void;
  onSuccess?: (updateClient: any) => void;
}

export function EditClientForm({ client, onClose, onSuccess }: EditClientFormProps) {
  const [formData, setFormData] = useState({
    name: client.name || '',
    siret: client.siret || '',
    address: client.address || '',
    companyType: client.company_type || '',
    contactName: client.contact_name || '',
    contactEmail: client.contact_email || '',
    contactPhone: client.contact_phone || '',
    serviceZone: client.service_zone || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedData = {
        name: formData.name,
        siret: formData.siret,
        company_type: formData.companyType,
        address: formData.address,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        service_zone: formData.serviceZone
      };

      await updateClient(client.id, updatedData); // Appel API pour mettre à jour en PostgreSQL

      if (onSuccess) {
        onSuccess({ id: client.id, ...updatedData });
      }
      onClose();
    } catch (err) {
      console.error("❌ Erreur lors de la mise à jour du client:", err);
      setError("Erreur lors de la mise à jour du client.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
      <>
        <div className="modal-backdrop" />
        <div className="modal-container">
          <div className="modal-content max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Modifier le client</h2>
              <Button variant="ghost" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
                  <input
                      type="text"
                      name="siret"
                      value={formData.siret}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forme juridique</label>
                  <input
                      type="text"
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zone de service</label>
                  <input
                      type="text"
                      name="serviceZone"
                      value={formData.serviceZone}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                  />
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact principal</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Mise à jour..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </>
  );
}