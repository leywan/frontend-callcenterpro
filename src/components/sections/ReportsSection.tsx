import React from 'react';
import { FileText, Download } from 'lucide-react';

export const ReportsSection = () => {
  const reports = [
    {
      id: '1',
      name: 'Rapport d\'activité mensuel',
      description: 'Synthèse des interventions et incidents du mois',
      date: new Date(2024, 1, 1),
      type: 'monthly',
    },
    {
      id: '2',
      name: 'Analyse des temps de réponse',
      description: 'Étude des délais de prise en charge des incidents',
      date: new Date(2024, 1, 15),
      type: 'analysis',
    },
    {
      id: '3',
      name: 'Performance des techniciens',
      description: 'Évaluation des interventions par technicien',
      date: new Date(2024, 1, 20),
      type: 'performance',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Rapports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="card">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {report.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {report.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {report.date.toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <Download size={18} />
                Télécharger
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};