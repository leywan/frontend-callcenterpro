import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { MessageSquare, X, Send, Paperclip, Image, Smile, ChevronDown, User, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { operators } from '../../data/mockData';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

const currentUser = operators.find(op => op.id === '1')!;

export const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, onMinimize }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '2',
      content: 'Salut ! J\'ai besoin d\'aide avec un ticket urgent.',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    },
    {
      id: '2',
      senderId: '1',
      content: 'Bien sûr, je peux t\'aider. De quel ticket s\'agit-il ?',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read'
    },
    {
      id: '3',
      senderId: '2',
      content: 'Le ticket #4789 pour Supermarché Central. Leur chambre froide montre des signes de dysfonctionnement.',
      timestamp: new Date(Date.now() - 3400000),
      status: 'read'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simuler une réponse
    setTimeout(() => {
      const response: Message = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: '2',
        content: 'Je vais examiner ça tout de suite.',
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages(prev => [...prev, response]);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              MD
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Marc Dubois</h3>
            <p className="text-xs text-gray-400">En ligne</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Phone size={18} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Video size={18} className="text-gray-400" />
          </button>
          <button
            onClick={onMinimize}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronDown size={18} className="text-gray-400" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser.id;
          const showDate = index === 0 || 
            new Date(messages[index - 1].timestamp).toDateString() !== new Date(message.timestamp).toDateString();

          return (
            <React.Fragment key={message.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                    {format(message.timestamp, 'EEEE d MMMM', { locale: fr })}
                  </span>
                </div>
              )}
              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {!isCurrentUser && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">
                    MD
                  </div>
                )}
                <div className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-600' : 'bg-gray-700'} rounded-lg px-4 py-2`}>
                  <p className="text-white">{message.content}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {format(message.timestamp, 'HH:mm')}
                    {isCurrentUser && (
                      <span className="ml-2">
                        {message.status === 'sent' && '✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'read' && '✓✓'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">
              MD
            </div>
            <div className="bg-gray-700 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <TextareaAutosize
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre message..."
              className="w-full bg-gray-700 rounded-lg pl-4 pr-12 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxRows={5}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <button className="p-1 hover:bg-gray-600 rounded transition-colors">
                <Paperclip size={16} className="text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-600 rounded transition-colors">
                <Image size={16} className="text-gray-400" />
              </button>
              <button
                className="p-1 hover:bg-gray-600 rounded transition-colors relative"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={16} className="text-gray-400" />
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-700 rounded-lg shadow-lg border border-gray-600 p-2">
                    <div className="grid grid-cols-8 gap-1">
                      {['😊', '😂', '🤔', '👍', '❤️', '🎉', '🔥', '👏'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setNewMessage(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="p-1 hover:bg-gray-600 rounded"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};