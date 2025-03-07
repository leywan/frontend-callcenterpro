class FeedbackService {
  async submitFeedback(clientId: string, data: {
    rating: number;
    comment?: string;
    interventionId?: string;
  }) {
    try {
      // TODO: Envoyer le feedback au backend
      console.log('Submitting feedback:', { clientId, data });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  async getFeedbackHistory(clientId: string) {
    try {
      // TODO: Récupérer l'historique des feedbacks depuis le backend
      return [];
    } catch (error) {
      console.error('Error fetching feedback history:', error);
      throw error;
    }
  }
}

export const feedbackService = new FeedbackService();