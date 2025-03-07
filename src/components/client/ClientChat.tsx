import React, { useState } from 'react';
import { Send, Paperclip, Image } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

interface ClientChatProps {
  clientId: string;
}

export const ClientChat: React.FC<ClientChatProps> = () => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // TODO: Implémenter l'envoi du message
    setMessage('');
  };

  return (
    <div className="space-y-4">
      <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-900 rounded-lg">
        {/* Message du support */}
        <div className="flex items-end gap-2">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              ST
            </div>
          </div>
          <div className="max-w-[80%]">
            <div className="bg-blue-600 text-white rounded-t-lg rounded-br-lg px-4 py-2">
              <p>Bonjour, comment puis-je vous aider ?</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">14:30</p>
          </div>
        </div>

        {/* Message du client */}
        <div className="flex items-end gap-2 justify-end">
          <div className="max-w-[80%]">
            <div className="bg-gray-700 text-white rounded-t-lg rounded-bl-lg px-4 py-2">
              <p>J'aimerais savoir quand le technicien va arriver.</p>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">14:32</p>
          </div>
        </div>

        {/* Message du support avec image */}
        <div className="flex items-end gap-2">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              ST
            </div>
          </div>
          <div className="max-w-[80%]">
            <div className="bg-blue-600 text-white rounded-t-lg rounded-br-lg px-4 py-2 space-y-2">
              <p>Le technicien est en route, voici sa position en temps réel :</p>
              <img
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&auto=format&fit=crop&q=60"
                alt="Carte de position"
                className="rounded-lg w-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">14:33</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <TextareaAutosize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="w-full pr-24 resize-none bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          minRows={2}
          maxRows={5}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
            <Image className="h-5 w-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};