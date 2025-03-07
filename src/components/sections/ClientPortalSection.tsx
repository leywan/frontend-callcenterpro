import React from 'react';
import { ClientPortal } from '../client/ClientPortal';

export const ClientPortalSection = () => {
  // TODO: Récupérer l'ID du client connecté
  const clientId = '1';

  return <ClientPortal clientId={clientId} />;
};