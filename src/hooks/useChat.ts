import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/socket';

interface Message {
  id: string;
  clientId: string;
  content: string;
  timestamp: Date;
  type: 'client' | 'support';
}

export const useChat = (clientId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    chatService.connect(clientId);
    setIsConnected(true);

    chatService.onMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      chatService.disconnect();
      setIsConnected(false);
    };
  }, [clientId]);

  const sendMessage = useCallback((content: string) => {
    if (!isConnected) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      clientId,
      content,
      timestamp: new Date(),
      type: 'client'
    };

    setMessages(prev => [...prev, message]);
    chatService.sendMessage(content);
  }, [clientId, isConnected]);

  return {
    messages,
    isConnected,
    sendMessage
  };
};