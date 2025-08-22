// Core game types
export interface Player {
  id: string;
  nickname: string;
  score: number;
  isHost?: boolean;
  avatar?: string;
  answers?: Answer[];
}

export interface Answer {
  questionId: string;
  selectedAnswer: number;
  timeRemaining: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  explanation: string;
  factCheckSource: {
    title: string;
    url: string;
    organization: string;
  };
  category: 'health' | 'politics' | 'social-media' | 'finance' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface GameSession {
  id: string;
  gameCode: string;
  hostId: string;
  status: 'waiting' | 'in-progress' | 'finished';
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  settings: GameSettings;
  createdAt: Date;
}

export interface GameSettings {
  questionPack: string;
  questionCount: 10 | 20 | 30;
  timePerQuestion: 20 | 30 | 45;
  visibility: 'public' | 'private';
  maxPlayers: number;
}

export interface PublicGame {
  id: string;
  name: string;
  hostName: string;
  questionPack: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'in-progress';
}

// User and profile types
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  bio: string;
  level: number;
  xp: number;
  createdAt: Date;
}

export interface UserStats {
  totalGames: number;
  gamesWon: number;
  winRate: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  averageTimePerQuestion: number;
  totalScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface BattleHistoryEntry {
  id: string;
  gameMode: 'team' | 'solo' | 'quick';
  result: 'victory' | 'defeat';
  score: number;
  date: Date;
  rank?: number;
}

// Leaderboard types
export type LeaderboardTab = 'friends' | 'local' | 'global' | 'daily' | 'weekly' | 'monthly';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  score: number;
  isCurrentUser?: boolean;
}

// Game results and analytics
export interface GameResults {
  gameId: string;
  finalLeaderboard: Player[];
  gameStats: {
    totalQuestions: number;
    averageAccuracy: number;
    fastestAnswer: number;
    slowestAnswer: number;
  };
  playerResults: {
    playerId: string;
    finalScore: number;
    rank: number;
    correctAnswers: number;
    averageTime: number;
  }[];
}

// Socket event types
export interface SocketEvents {
  // Lobby events
  'join-host-lobby': { gameId: string };
  'join-player-lobby': { gameId: string; playerId: string };
  'player-joined': Player;
  'player-left': { playerId: string };
  'kick-player': { gameId: string; playerId: string };
  
  // Game events
  'start-game': { gameId: string; settings: GameSettings };
  'game-started': { firstQuestion: Question };
  'question-displayed': Question;
  'submit-answer': { playerId: string; questionId: string; answer: number; timeRemaining: number };
  'answer-submitted': { playerId: string; answer: number };
  'question-results': { correctAnswer: number; explanation: string; leaderboard: Player[] };
  'game-ended': { finalResults: GameResults };
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateGameResponse {
  gameId: string;
  gameCode: string;
  hostToken: string;
}

export interface JoinGameResponse {
  playerId: string;
  gameSession: GameSession;
}