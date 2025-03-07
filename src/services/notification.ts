interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

class NotificationService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  async sendSMS(to: string, message: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  async sendEmail(to: string, subject: string, content: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async updatePreferences(clientId: string, preferences: NotificationPreferences) {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/preferences/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  async getPreferences(clientId: string): Promise<NotificationPreferences> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/preferences/${clientId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // Retourner des préférences par défaut en cas d'erreur
      return {
        email: true,
        sms: true,
        push: false,
      };
    }
  }
}

export const notificationService = new NotificationService();