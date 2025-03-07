import React, { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { Button } from '../../components/ui/button';
import axios from 'axios';

interface ImportExportClientsProps {
  companyId: string;
  onImportSuccess?: () => void;
}

export function ImportExportClients({ companyId, onImportSuccess }: Readonly<ImportExportClientsProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);


  /**
   * EXPORT CSV
   * Récupère la liste des clients depuis l'API Spring Boot,
   * convertit en CSV avec Papa.unparse et déclenche le téléchargement.
   */
  const handleExport = async () => {
    if (!companyId) {
      console.error("❌ Aucune entreprise sélectionnée !");
      return;
    }

    try {
      const response = await axios.get(`/api/clients/export/${companyId}`, {
        responseType: "blob", // 📌 IMPORTANT : on récupère un fichier binaire
      });

      // Vérifie si la réponse est bien un CSV et non du HTML (erreur backend)
      const contentType = response.headers["content-type"];
      if (!contentType.includes("text/csv")) {
        console.error("❌ Erreur : la réponse n'est pas un fichier CSV !");

        // Lire le contenu du fichier pour voir ce qu'on récupère
        const text = await response.data.text();
        console.error("Réponse du serveur :", text);
        return;
      }

      // Création du fichier CSV
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `clients_${companyId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("✅ Export réussi !");
    } catch (error) {
      console.error("❌ Erreur lors de l'export :", error);
    }
  };

  /**
   * IMPORT CSV
   * Lit un fichier CSV, parse avec Papa, puis envoie les données au backend via Axios.
   */
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);

    const formData = new FormData();
    formData.append("file", file); // ✅ On envoie bien un fichier en multipart

    try {
      const response = await axios.post("/api/clients/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ Important
        },
      });

      alert("✅ Importation réussie !");
      console.log("Réponse du serveur :", response.data);
    } catch (error) {
      console.error("❌ Erreur lors de l'importation :", error);
      alert("❌ Erreur lors de l'importation !");
    } finally {
      setImporting(false);
    }
  };

  return (
      <div className="flex space-x-4">
        {/* Champ fichier CSV caché */}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".csv"
            className="hidden"
        />

        {/* Bouton Import */}
        <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center"
            disabled={importing}
        >
          <Upload className="h-4 w-4 mr-2" />
          {importing ? 'Importation...' : 'Importer CSV'}
        </Button>

        {/* Bouton Export */}
        <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>
  );
}
