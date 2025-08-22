import { GameSession, User, UserStats, Question, Achievement, LeaderboardEntry } from '@/types';

/**
 * In-memory data store for the application
 * In production, this would be replaced with a proper database
 */
class DataStore {
  private games: Map<string, GameSession> = new Map();
  private gamesByCode: Map<string, string> = new Map(); // gameCode -> gameId
  private users: Map<string, User> = new Map();
  private userStats: Map<string, UserStats> = new Map();
  private questions: Question[] = [];
  private achievements: Achievement[] = [];
  private leaderboards: Map<string, LeaderboardEntry[]> = new Map();

  // Game operations
  createGame(game: GameSession): void {
    this.games.set(game.id, game);
    this.gamesByCode.set(game.gameCode, game.id);
  }

  getGame(gameId: string): GameSession | null {
    return this.games.get(gameId) || null;
  }

  getGameByCode(gameCode: string): GameSession | null {
    const gameId = this.gamesByCode.get(gameCode);
    return gameId ? this.games.get(gameId) || null : null;
  }

  updateGame(gameId: string, game: GameSession): void {
    this.games.set(gameId, game);
  }

  deleteGame(gameId: string): void {
    const game = this.games.get(gameId);
    if (game) {
      this.gamesByCode.delete(game.gameCode);
      this.games.delete(gameId);
    }
  }

  getAllGames(): GameSession[] {
    return Array.from(this.games.values());
  }

  getPublicGames(): GameSession[] {
    return Array.from(this.games.values()).filter(
      game => game.settings.visibility === 'public' && game.status === 'waiting'
    );
  }

  // User operations
  createUser(user: User): void {
    this.users.set(user.id, user);
  }

  getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  getUserByUsername(username: string): User | null {
    return Array.from(this.users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase()
    ) || null;
  }

  updateUser(userId: string, user: User): void {
    this.users.set(userId, user);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // User stats operations
  createUserStats(stats: UserStats): void {
    this.userStats.set(stats.userId, stats);
  }

  getUserStats(userId: string): UserStats | null {
    return this.userStats.get(userId) || null;
  }

  updateUserStats(userId: string, stats: UserStats): void {
    this.userStats.set(userId, stats);
  }

  // Question operations
  addQuestion(question: Question): void {
    this.questions.push(question);
  }

  addQuestions(questions: Question[]): void {
    this.questions.push(...questions);
  }

  getQuestions(filters?: {
    category?: string;
    difficulty?: string;
    limit?: number;
  }): Question[] {
    let filtered = [...this.questions];

    if (filters?.category) {
      filtered = filtered.filter(q => q.category === filters.category);
    }

    if (filters?.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  getRandomQuestions(count: number, filters?: {
    category?: string;
    difficulty?: string;
  }): Question[] {
    const available = this.getQuestions(filters);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Achievement operations
  addAchievement(achievement: Achievement): void {
    this.achievements.push(achievement);
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  // Leaderboard operations
  setLeaderboard(type: string, entries: LeaderboardEntry[]): void {
    this.leaderboards.set(type, entries);
  }

  getLeaderboard(type: string): LeaderboardEntry[] {
    return this.leaderboards.get(type) || [];
  }

  // Cleanup operations
  cleanupExpiredGames(): void {
    const now = new Date();
    const expiredGames: string[] = [];

    this.games.forEach((game, gameId) => {
      const gameAge = now.getTime() - game.createdAt.getTime();
      const isExpired = gameAge > (2 * 60 * 60 * 1000); // 2 hours

      if (isExpired || (game.status === 'finished' && gameAge > (30 * 60 * 1000))) {
        expiredGames.push(gameId);
      }
    });

    expiredGames.forEach(gameId => this.deleteGame(gameId));
  }

  // Statistics
  getStats() {
    return {
      totalGames: this.games.size,
      activeGames: Array.from(this.games.values()).filter(g => g.status !== 'finished').length,
      totalUsers: this.users.size,
      totalQuestions: this.questions.length,
      publicGames: this.getPublicGames().length
    };
  }
}

// Create singleton instance
export const dataStore = new DataStore();

// Initialize with sample data
export function initializeSampleData() {
  // Sample questions
  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      text: 'Which of the following is a reliable way to fact-check information you see on social media?',
      options: [
        'Check if it has many likes and shares',
        'Look for the original source and cross-reference with reputable news outlets',
        'See if your friends are sharing it too',
        'Trust it if it confirms what you already believe'
      ],
      correctAnswer: 1,
      explanation: 'The most reliable way to fact-check information is to trace it back to its original source and verify it with multiple reputable news outlets or fact-checking organizations.',
      factCheckSource: {
        title: 'How to Spot Fake News',
        url: 'https://www.factcheck.org/2016/11/how-to-spot-fake-news/',
        organization: 'FactCheck.org'
      },
      category: 'social-media',
      difficulty: 'medium',
      tags: ['fact-checking', 'social-media', 'verification'],
      timeLimit: 30
    },
    {
      id: 'q2',
      text: 'What is a common sign that a health claim on social media might be misinformation?',
      options: [
        'It cites peer-reviewed scientific studies',
        'It promises miraculous results with no side effects',
        'It recommends consulting with healthcare professionals',
        'It provides links to reputable medical organizations'
      ],
      correctAnswer: 1,
      explanation: 'Health misinformation often promises miraculous results with no side effects. Legitimate health information acknowledges potential risks and limitations.',
      factCheckSource: {
        title: 'Health Misinformation Guide',
        url: 'https://www.who.int/news-room/feature-stories/detail/fighting-misinformation-in-the-time-of-covid-19',
        organization: 'World Health Organization'
      },
      category: 'health',
      difficulty: 'easy',
      tags: ['health', 'misinformation', 'medical'],
      timeLimit: 30
    },
    {
      id: 'q3',
      text: 'Which technique is commonly used to make fake news appear more credible?',
      options: [
        'Using emotional language and sensational headlines',
        'Providing multiple credible sources',
        'Including author credentials and contact information',
        'Presenting balanced viewpoints'
      ],
      correctAnswer: 0,
      explanation: 'Fake news often uses emotional language and sensational headlines to grab attention and bypass critical thinking.',
      factCheckSource: {
        title: 'Anatomy of Fake News',
        url: 'https://www.poynter.org/fact-checking/',
        organization: 'Poynter Institute'
      },
      category: 'general',
      difficulty: 'medium',
      tags: ['fake-news', 'manipulation', 'psychology'],
      timeLimit: 30
    },
    {
      id: 'q4',
      text: 'What should you do before sharing a news article on social media?',
      options: [
        'Share it immediately if it supports your views',
        'Check the publication date and verify the source',
        'Only read the headline',
        'Share it if it has many comments'
      ],
      correctAnswer: 1,
      explanation: 'Always verify the source and check the publication date before sharing. Old news can be misleading when shared out of context.',
      factCheckSource: {
        title: 'Social Media Literacy Guide',
        url: 'https://www.commonsensemedia.org/news-and-media-literacy',
        organization: 'Common Sense Media'
      },
      category: 'social-media',
      difficulty: 'easy',
      tags: ['sharing', 'verification', 'responsibility'],
      timeLimit: 30
    },
    {
      id: 'q5',
      text: 'Which of these is a red flag for financial misinformation?',
      options: [
        'Detailed risk disclosures',
        'Promises of guaranteed high returns with no risk',
        'Recommendations to diversify investments',
        'Advice to consult financial advisors'
      ],
      correctAnswer: 1,
      explanation: 'Legitimate investments always carry risk. Any promise of guaranteed high returns with no risk is a major red flag for financial fraud.',
      factCheckSource: {
        title: 'Investment Fraud Prevention',
        url: 'https://www.sec.gov/investor/pubs/tenthingstoconsider.htm',
        organization: 'U.S. Securities and Exchange Commission'
      },
      category: 'finance',
      difficulty: 'medium',
      tags: ['finance', 'investment', 'fraud'],
      timeLimit: 30
    }
  ];

  dataStore.addQuestions(sampleQuestions);

  // Sample achievements
  const sampleAchievements: Achievement[] = [
    {
      id: 'first_victory',
      name: 'First Victory',
      description: 'Win your first game',
      icon: 'emoji_events',
      category: 'milestone',
      requirement: { type: 'games_won', value: 1 }
    },
    {
      id: 'hot_streak',
      name: 'Hot Streak',
      description: 'Win 5 games in a row',
      icon: 'local_fire_department',
      category: 'streak',
      requirement: { type: 'streak', value: 5 }
    },
    {
      id: 'fact_checker',
      name: 'Fact Checker',
      description: 'Answer 100 questions correctly',
      icon: 'auto_stories',
      category: 'accuracy',
      requirement: { type: 'correct_answers', value: 100 }
    },
    {
      id: 'party_starter',
      name: 'Party Starter',
      description: 'Host your first game',
      icon: 'groups',
      category: 'social',
      requirement: { type: 'games_won', value: 1 }
    }
  ];

  sampleAchievements.forEach(achievement => dataStore.addAchievement(achievement));

  console.log('Sample data initialized successfully');
}

// Auto-cleanup expired games every 10 minutes
setInterval(() => {
  dataStore.cleanupExpiredGames();
}, 10 * 60 * 1000);