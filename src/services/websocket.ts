import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    this.url = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
  }

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(this.url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinHunt(huntId: string): void {
    if (this.socket) {
      this.socket.emit('join-hunt', huntId);
    }
  }

  leaveHunt(huntId: string): void {
    if (this.socket) {
      this.socket.emit('leave-hunt', huntId);
    }
  }

  onHuntReady(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('hunt-ready', callback);
    }
  }

  onHuntProgress(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('hunt-progress', callback);
    }
  }

  onHuntUpdated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('hunt-updated', callback);
    }
  }

  onHuntError(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('hunt-error', callback);
    }
  }

  off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const wsService = new WebSocketService();