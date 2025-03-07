import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface FeedbackFormProps {
  clientId: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du feedback
    console.log({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Évaluez notre service
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <Star
                className={`h-8 w-8 ${
                  value <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Commentaire (optionnel)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          rows={4}
          placeholder="Partagez votre expérience..."
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0}
        className="w-full btn-primary"
      >
        Envoyer mon avis
      </button>
    </form>
  );
};