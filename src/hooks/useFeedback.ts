import { useState, useCallback } from 'react';
import { feedbackService } from '../services/feedback';

export const useFeedback = (clientId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = useCallback(async (data: {
    rating: number;
    comment?: string;
    interventionId?: string;
  }) => {
    setIsSubmitting(true);
    try {
      await feedbackService.submitFeedback(clientId, data);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [clientId]);

  return {
    isSubmitting,
    submitFeedback
  };
};