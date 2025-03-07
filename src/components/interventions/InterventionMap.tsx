import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { MapPin, Navigation } from 'lucide-react';
import type { Technician, Intervention, Client } from '../../types';

interface InterventionMapProps {
  technicians: Technician[];
  interventions: Intervention[];
  clients: Client[];
  center?: google.maps.LatLngLiteral;
  onTechnicianSelect?: (technicianId: string) => void;
  onInterventionSelect?: (interventionId: string) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        { saturation: -100 },
        { lightness: 30 }
      ]
    }
  ]
};

export const InterventionMap: React.FC<InterventionMapProps> = ({
  technicians,
  interventions,
  clients,
  center = defaultCenter,
  onTechnicianSelect,
  onInterventionSelect
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  if (loadError) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-red-500">
        <p className="text-center">Erreur de chargement de la carte</p>
        <p className="text-sm text-center mt-2">Veuillez vérifier votre clé API Google Maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        <p className="text-center text-gray-400 mt-4">Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-700">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={mapOptions}
      >
        {/* Marqueurs des techniciens */}
        {technicians.map(technician => {
          if (!technician.location) return null;
          
          return (
            <Marker
              key={technician.id}
              position={technician.location}
              icon={{
                path: Navigation({}).type,
                fillColor: technician.availability === 'available' ? '#22c55e' : '#ef4444',
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: '#fff',
                scale: 1.5,
                rotation: 0
              }}
              onClick={() => {
                setSelectedTechnician(technician);
                if (onTechnicianSelect) onTechnicianSelect(technician.id);
              }}
            />
          );
        })}

        {/* Marqueurs des clients avec interventions en cours */}
        {interventions.map(intervention => {
          const client = clients.find(c => c.id === intervention.incidentId.split('-')[0]);
          if (!client?.location) return null;

          return (
            <Marker
              key={intervention.id}
              position={client.location}
              icon={{
                path: MapPin({}).type,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: '#fff',
                scale: 1.5
              }}
              onClick={() => {
                if (onInterventionSelect) onInterventionSelect(intervention.id);
              }}
            />
          );
        })}

        {/* Affichage des itinéraires */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#3b82f6',
                strokeWeight: 4
              }
            }}
          />
        )}
      </GoogleMap>

      {/* Panneau d'informations du technicien sélectionné */}
      {selectedTechnician && (
        <div className="absolute top-4 right-4 bg-gray-800 rounded-lg shadow-lg p-4 w-80 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">{selectedTechnician.name}</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 text-gray-300">
              <span className={`w-2 h-2 rounded-full ${
                selectedTechnician.availability === 'available'
                  ? 'bg-green-500'
                  : selectedTechnician.availability === 'busy'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`} />
              {selectedTechnician.availability === 'available'
                ? 'Disponible'
                : selectedTechnician.availability === 'busy'
                ? 'En intervention'
                : 'Hors ligne'}
            </p>
            <p className="text-gray-300">{selectedTechnician.specialization}</p>
            <p className="text-gray-300">{selectedTechnician.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
};