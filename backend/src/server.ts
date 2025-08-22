import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { config, rateLimits } from '@/config';
import { dataStore, initializeSampleData } from '@/data/store';
import { GameSocketHandler } from '@/socket/gameHandler';

// Import routes
import gamesRouter from '@/routes/games';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Initialize game socket handler
const gameSocketHandler = new GameSocketHandler(io);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const createGameLimiter = rateLimit({
  windowMs: rateLimits.createGame.windowMs,
  max: rateLimits.createGame.max,
  message: {
    success: false,
    error: 'Too many games created. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const joinGameLimiter = rateLimit({
  windowMs: rateLimits.joinGame.windowMs,
  max: rateLimits.joinGame.max,
  message: {
    success: false,
    error: 'Too many join attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to specific routes
app.use('/api/games/create', createGameLimiter);
app.use('/api/games/join', joinGameLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  const stats = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.environment,
    version: process.env.npm_package_version || '1.0.0',
    dataStore: dataStore.getStats(),
    socket: gameSocketHandler.getStats()
  };
  
  res.json(stats);
});

// API routes
app.use('/api/games', gamesRouter);

// Questions endpoint
app.get('/api/questions', (req, res) => {
  try {
    const { category, difficulty, limit } = req.query;
    
    const questions = dataStore.getQuestions({
      category: category as string,
      difficulty: difficulty as string,
      limit: limit ? parseInt(limit as string) : undefined
    });

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch questions'
    });
  }
});

// Question packs endpoint
app.get('/api/question-packs', (req, res) => {
  try {
    const packs = [
      { id: 'general', name: 'General Knowledge', description: 'Mixed topics for general media literacy' },
      { id: 'health', name: 'Health Misinformation', description: 'Medical myths and health-related fake news' },
      { id: 'social-media', name: 'Social Media Myths', description: 'Common misinformation spread on social platforms' },
      { id: 'politics', name: 'Political Misinformation', description: 'Election fraud and political fake news' },
      { id: 'finance', name: 'Financial Scams', description: 'Investment fraud and financial misinformation' }
    ];

    res.json({
      success: true,
      data: packs
    });
  } catch (error) {
    console.error('Error fetching question packs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch question packs'
    });
  }
});

// Leaderboard endpoints
app.get('/api/leaderboard/:type', (req, res) => {
  try {
    const { type } = req.params;
    
    // Generate sample leaderboard data
    const sampleLeaderboard = [
      { rank: 1, userId: '1', username: 'TruthSlayer99', avatar: '/avatars/1.jpg', score: 15430, gamesPlayed: 45, winRate: 85 },
      { rank: 2, userId: '2', username: 'FactCheckerPro', avatar: '/avatars/2.jpg', score: 14980, gamesPlayed: 38, winRate: 82 },
      { rank: 3, userId: '3', username: 'Misinfo-Buster', avatar: '/avatars/3.jpg', score: 14210, gamesPlayed: 42, winRate: 78 },
      { rank: 4, userId: '4', username: 'NewsNinja', avatar: '/avatars/4.jpg', score: 13850, gamesPlayed: 35, winRate: 80 },
      { rank: 5, userId: '5', username: 'VeritasSeeker', avatar: '/avatars/5.jpg', score: 13500, gamesPlayed: 40, winRate: 75 }
    ];

    // Add current user at rank 98
    const userPosition = {
      rank: 98,
      userId: 'current',
      username: 'TheDebunker',
      avatar: '/avatars/current.jpg',
      score: 8120,
      gamesPlayed: 25,
      winRate: 68,
      isCurrentUser: true
    };

    res.json({
      success: true,
      data: {
        entries: sampleLeaderboard,
        userPosition
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// User stats endpoint
app.get('/api/user/stats', (req, res) => {
  try {
    const stats = {
      username: 'TruthSeeker22',
      totalWins: 42,
      totalBattles: 117,
      winRate: 35.9,
      correctAnswers: 345,
      incorrectAnswers: 98,
      accuracy: 77.8,
      avgTimePerQuestion: 8.2,
      totalScore: 28450,
      level: 12,
      xp: 6000,
      nextLevelXp: 10000
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats'
    });
  }
});

// Battle history endpoint
app.get('/api/user/history', (req, res) => {
  try {
    const history = [
      { id: '1', gameMode: 'team', result: 'victory', score: 1250, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), rank: 1 },
      { id: '2', gameMode: 'solo', result: 'defeat', score: 780, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), rank: 8 },
      { id: '3', gameMode: 'team', result: 'victory', score: 1500, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), rank: 2 },
      { id: '4', gameMode: 'quick', result: 'defeat', score: 950, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), rank: 5 }
    ];

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching battle history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch battle history'
    });
  }
});

// Achievements endpoint
app.get('/api/user/achievements', (req, res) => {
  try {
    const achievements = dataStore.getAchievements().map(achievement => ({
      ...achievement,
      isUnlocked: Math.random() > 0.3 // Randomly unlock achievements for demo
    }));

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievements'
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: config.environment === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Initialize sample data
initializeSampleData();

// Start server
server.listen(config.port, () => {
  console.log(`🚀 TruthQuest Backend Server running on port ${config.port}`);
  console.log(`📊 Environment: ${config.environment}`);
  console.log(`🌐 CORS Origins: ${config.corsOrigin.join(', ')}`);
  console.log(`📝 Sample data initialized with ${dataStore.getQuestions().length} questions`);
  
  if (config.environment === 'development') {
    console.log(`🔗 Health check: http://localhost:${config.port}/health`);
    console.log(`🎮 Socket.IO ready for real-time game connections`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;