import React from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  timestamp: Date;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [], // Valeur par défaut pour éviter l'erreur
  onDismiss,
}) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type} animate-slide-in`}
          role="alert"
        >
          {getIcon(notification.type)}
          <div className="flex-1">
            {notification.title && (
              <h4 className="font-medium text-white">{notification.title}</h4>
            )}
            <p className="text-sm text-gray-300">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {notification.timestamp.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => onDismiss(notification.id)}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
};