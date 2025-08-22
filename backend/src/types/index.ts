// Shared types between frontend and backend
export interface Player {
  id: string;
  nickname: string;
  score: number;
  isHost?: boolean;
  avatar?: string;
  answers?: Answer[];
  socketId?: string;
  joinedAt: Date;
}

export interface Answer {
  questionId: string;
  selectedAnswer: number;
  timeRemaining: number;
  isCorrect: boolean;
  pointsEarned: number;
  submittedAt: Date;
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
  timeLimit: number;
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
  startedAt?: Date;
  finishedAt?: Date;
  currentQuestionStartTime?: Date;
}

export interface GameSettings {
  questionPack: string;
  questionCount: 10 | 20 | 30;
  timePerQuestion: 20 | 30 | 45;
  visibility: 'public' | 'private';
  maxPlayers: number;
  allowLateJoin: boolean;
}

export interface PublicGame {
  id: string;
  name: string;
  hostName: string;
  questionPack: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'in-progress';
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  bio: string;
  level: number;
  xp: number;
  createdAt: Date;
  lastActive: Date;
}

export interface UserStats {
  userId: string;
  totalGames: number;
  gamesWon: number;
  winRate: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  averageTimePerQuestion: number;
  totalScore: number;
  bestStreak: number;
  categoriesPlayed: string[];
  achievementsUnlocked: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: {
    type: 'games_won' | 'correct_answers' | 'streak' | 'category_master' | 'time_played';
    value: number;
    category?: string;
  };
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  score: number;
  gamesPlayed: number;
  winRate: number;
  isCurrentUser?: boolean;
}

export interface GameResults {
  gameId: string;
  finalLeaderboard: Player[];
  gameStats: {
    totalQuestions: number;
    averageAccuracy: number;
    fastestAnswer: number;
    slowestAnswer: number;
    totalPlayTime: number;
  };
  playerResults: {
    playerId: string;
    finalScore: number;
    rank: number;
    correctAnswers: number;
    averageTime: number;
    accuracy: number;
  }[];
}

// API Response types
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

// Socket event types
export interface SocketEvents {
  // Connection events
  'connect': void;
  'disconnect': void;
  
  // Lobby events
  'join-host-lobby': { gameId: string; hostToken: string };
  'join-player-lobby': { gameId: string; playerId: string };
  'player-joined': Player;
  'player-left': { playerId: string };
  'kick-player': { gameId: string; playerId: string };
  'player-kicked': { playerId: string };
  'lobby-updated': { players: Player[]; settings: GameSettings };
  
  // Game events
  'start-game': { gameId: string; settings: GameSettings };
  'game-started': { firstQuestion: Question; questionNumber: number };
  'question-displayed': { question: Question; questionNumber: number; timeLimit: number };
  'submit-answer': { playerId: string; questionId: string; answer: number; timeRemaining: number };
  'answer-submitted': { playerId: string; answer: number };
  'question-results': { 
    correctAnswer: number; 
    explanation: string; 
    factCheckSource: Question['factCheckSource'];
    leaderboard: Player[];
    playerAnswers: { playerId: string; answer: number; isCorrect: boolean; pointsEarned: number }[];
  };
  'next-question': { question: Question; questionNumber: number };
  'game-ended': { finalResults: GameResults };
  
  // Error events
  'error': { message: string; code?: string };
  'game-not-found': void;
  'player-not-found': void;
  'unauthorized': void;
}

// Database models
export interface GameModel extends GameSession {
  _id?: string;
}

export interface UserModel extends User {
  _id?: string;
  passwordHash?: string;
}

export interface StatsModel extends UserStats {
  _id?: string;
}

export interface QuestionModel extends Question {
  _id?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Configuration types
export interface ServerConfig {
  port: number;
  corsOrigin: string[];
  jwtSecret: string;
  dbConnectionString?: string;
  redisUrl?: string;
  environment: 'development' | 'production' | 'test';
}

// Utility types
export type LeaderboardType = 'global' | 'friends' | 'local' | 'daily' | 'weekly' | 'monthly';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  category?: string;
  difficulty?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}