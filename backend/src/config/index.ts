import dotenv from 'dotenv';
import { ServerConfig } from '@/types';

dotenv.config();

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  jwtSecret: process.env.JWT_SECRET || 'truthquest-dev-secret-key',
  dbConnectionString: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development'
};

export const gameConfig = {
  maxPlayersPerGame: 50,
  gameCodeLength: 6,
  gameCodeExpiry: 24 * 60 * 60 * 1000, // 24 hours
  maxGamesPerHost: 5,
  questionTimeBuffer: 2000, // 2 seconds buffer for network latency
  lobbyTimeout: 30 * 60 * 1000, // 30 minutes
  gameTimeout: 2 * 60 * 60 * 1000, // 2 hours
};

export const scoringConfig = {
  basePoints: {
    easy: 500,
    medium: 750,
    hard: 1000
  },
  speedBonusMultiplier: 0.5, // 50% of remaining time as bonus
  streakBonus: {
    3: 100,  // 3 correct in a row
    5: 250,  // 5 correct in a row
    10: 500  // 10 correct in a row
  }
};

export const rateLimits = {
  createGame: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 games per 15 minutes
  },
  joinGame: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10 // 10 join attempts per minute
  },
  submitAnswer: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100 // 100 answers per minute
  }
};