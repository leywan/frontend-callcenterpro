import { io, Socket } from 'socket.io-client';

class ChatService {
  private socket: Socket | null = null;
  private clientId: string | null = null;

  connect(clientId: string) {
    this.clientId = clientId;
    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      query: { clientId }
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: string) {
    if (!this.socket || !this.clientId) return;

    this.socket.emit('message', {
      clientId: this.clientId,
      content: message,
      timestamp: new Date()
    });
  }

  onMessage(callback: (message: any) => void) {
    if (!this.socket) return;
    this.socket.on('message', callback);
  }
}

export const chatService = new ChatService();