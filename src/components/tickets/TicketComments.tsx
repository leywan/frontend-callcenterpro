import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface TicketCommentsProps {
  ticketId: string;
}

export function TicketComments({ ticketId }: TicketCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  async function fetchComments() {
    const { data, error } = await supabase
      .from('ticket_comments')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    setComments(data);
    setLoading(false);
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    // Générer un UUID pour l'utilisateur temporaire
    const tempUserId = crypto.randomUUID();

    const { error } = await supabase
      .from('ticket_comments')
      .insert([
        {
          ticket_id: ticketId,
          content: newComment,
          user_id: tempUserId
        }
      ]);

    if (error) {
      console.error('Error adding comment:', error);
      return;
    }

    setNewComment('');
    fetchComments();
  }

  if (loading) {
    return <div className="text-center py-4">Chargement des commentaires...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="Ajouter un commentaire..."
          required
        />
        <div className="flex justify-end">
          <Button type="submit">
            Ajouter le commentaire
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Utilisateur {comment.user_id.substring(0, 8)}
                </p>
                <p className="text-sm text-gray-500">
                  {format(parseISO(comment.created_at), "d MMMM 'à' HH:mm", { locale: fr })}
                </p>
                <div className="mt-2 text-sm text-gray-700">
                  {comment.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}