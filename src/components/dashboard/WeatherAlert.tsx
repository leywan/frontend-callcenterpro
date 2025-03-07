import React from 'react';
import { Cloud, Sun, Thermometer } from 'lucide-react';

const mockWeatherAlerts = [
  {
    region: 'Île-de-France',
    temperature: 35,
    alert: 'Vigilance canicule',
    impact: 'Risque de surchauffe des systèmes de réfrigération',
    recommendations: 'Augmenter la fréquence des contrôles de température'
  },
  {
    region: 'Normandie',
    temperature: 33,
    alert: 'Pic de chaleur',
    impact: 'Performance réduite des condenseurs',
    recommendations: 'Vérifier la ventilation des groupes froids'
  }
];

export function WeatherAlert() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alertes météo</h3>
        <Sun className="h-6 w-6 text-yellow-500" />
      </div>
      <div className="space-y-4">
        {mockWeatherAlerts.map((alert, index) => (
          <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-orange-800">{alert.region}</span>
              <div className="flex items-center text-orange-800">
                <Thermometer className="h-4 w-4 mr-1" />
                {alert.temperature}°C
              </div>
            </div>
            <p className="text-sm text-orange-800 font-medium mb-2">{alert.alert}</p>
            <p className="text-sm text-orange-700 mb-1">Impact: {alert.impact}</p>
            <p className="text-sm text-orange-700">
              Recommandation: {alert.recommendations}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}