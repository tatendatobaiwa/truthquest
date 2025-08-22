'use client';

import { APIResponse, CreateGameResponse, JoinGameResponse, GameSession, PublicGame } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class APIClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Game API methods
  async createGame(settings: {
    questionPack: string;
    questionCount: number;
    timePerQuestion: number;
    visibility: string;
    maxPlayers: number;
  }, hostNickname: string): Promise<CreateGameResponse> {
    const response = await this.request<CreateGameResponse>('/games/create', {
      method: 'POST',
      body: JSON.stringify({ settings, hostNickname }),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create game');
    }

    return response.data;
  }

  async joinGame(gameCode: string, nickname: string): Promise<JoinGameResponse> {
    const response = await this.request<JoinGameResponse>('/games/join', {
      method: 'POST',
      body: JSON.stringify({ gameCode, nickname }),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to join game');
    }

    return response.data;
  }

  async getPublicGames(): Promise<PublicGame[]> {
    const response = await this.request<PublicGame[]>('/games/public');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch public games');
    }

    return response.data;
  }

  async getGame(gameId: string): Promise<GameSession> {
    const response = await this.request<GameSession>(`/games/${gameId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch game');
    }

    return response.data;
  }

  async startGame(gameId: string, hostToken: string): Promise<GameSession> {
    const response = await this.request<GameSession>(`/games/${gameId}/start`, {
      method: 'POST',
      body: JSON.stringify({ hostToken }),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to start game');
    }

    return response.data;
  }

  async submitAnswer(
    gameId: string,
    playerId: string,
    questionId: string,
    answer: number,
    timeRemaining: number
  ): Promise<void> {
    const response = await this.request(`/games/${gameId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ playerId, questionId, answer, timeRemaining }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to submit answer');
    }
  }

  // Question API methods
  async getQuestions(filters?: {
    category?: string;
    difficulty?: string;
    limit?: number;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const endpoint = `/questions${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.request<any[]>(endpoint);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch questions');
    }

    return response.data;
  }

  async getQuestionPacks(): Promise<any[]> {
    const response = await this.request<any[]>('/question-packs');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch question packs');
    }

    return response.data;
  }

  // User API methods
  async getUserStats(): Promise<any> {
    const response = await this.request<any>('/user/stats');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch user stats');
    }

    return response.data;
  }

  async getBattleHistory(): Promise<any[]> {
    const response = await this.request<any[]>('/user/history');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch battle history');
    }

    return response.data;
  }

  async getUserAchievements(): Promise<any[]> {
    const response = await this.request<any[]>('/user/achievements');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch achievements');
    }

    return response.data;
  }

  // Leaderboard API methods
  async getLeaderboard(type: string): Promise<{ entries: any[]; userPosition?: any }> {
    const response = await this.request<{ entries: any[]; userPosition?: any }>(`/leaderboard/${type}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch leaderboard');
    }

    return response.data;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  }
}

export const apiClient = new APIClient();