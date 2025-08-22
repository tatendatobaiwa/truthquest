'use client';

import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventHandlers();
    return this.socket;
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
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

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Game-specific socket methods
  joinHostLobby(gameId: string, hostToken: string) {
    this.socket?.emit('join-host-lobby', { gameId, hostToken });
  }

  joinPlayerLobby(gameId: string, playerId: string) {
    this.socket?.emit('join-player-lobby', { gameId, playerId });
  }

  startGame(gameId: string, settings: any) {
    this.socket?.emit('start-game', { gameId, settings });
  }

  submitAnswer(playerId: string, questionId: string, answer: number, timeRemaining: number) {
    this.socket?.emit('submit-answer', { playerId, questionId, answer, timeRemaining });
  }

  kickPlayer(gameId: string, playerId: string) {
    this.socket?.emit('kick-player', { gameId, playerId });
  }

  // Event listeners
  onPlayerJoined(callback: (player: any) => void) {
    this.socket?.on('player-joined', callback);
  }

  onPlayerLeft(callback: (data: { playerId: string }) => void) {
    this.socket?.on('player-left', callback);
  }

  onLobbyUpdated(callback: (data: { players: any[]; settings: any }) => void) {
    this.socket?.on('lobby-updated', callback);
  }

  onGameStarted(callback: (data: { firstQuestion: any; questionNumber: number }) => void) {
    this.socket?.on('game-started', callback);
  }

  onQuestionDisplayed(callback: (data: { question: any; questionNumber: number; timeLimit: number }) => void) {
    this.socket?.on('question-displayed', callback);
  }

  onAnswerSubmitted(callback: (data: { playerId: string; answer: number }) => void) {
    this.socket?.on('answer-submitted', callback);
  }

  onQuestionResults(callback: (data: {
    correctAnswer: number;
    explanation: string;
    factCheckSource: any;
    leaderboard: any[];
    playerAnswers: any[];
  }) => void) {
    this.socket?.on('question-results', callback);
  }

  onGameEnded(callback: (data: { finalResults: any }) => void) {
    this.socket?.on('game-ended', callback);
  }

  onPlayerKicked(callback: (data: { playerId: string }) => void) {
    this.socket?.on('player-kicked', callback);
  }

  onError(callback: (error: { message: string; code?: string }) => void) {
    this.socket?.on('error', callback);
  }

  // Remove event listeners
  off(event: string, callback?: Function) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

// Create singleton instance
export const socketManager = new SocketManager();

// Hook for React components
export function useSocket() {
  return {
    socket: socketManager.getSocket(),
    connect: () => socketManager.connect(),
    disconnect: () => socketManager.disconnect(),
    isConnected: () => socketManager.isConnected(),
    ...socketManager
  };
}