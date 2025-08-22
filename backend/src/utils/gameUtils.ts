import { v4 as uuidv4 } from 'uuid';
import { GameSession, Player, Question, Answer, GameResults } from '@/types';
import { gameConfig, scoringConfig } from '@/config';

/**
 * Generate a unique 6-character game code
 */
export function generateGameCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < gameConfig.gameCodeLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a unique player ID
 */
export function generatePlayerId(): string {
  return uuidv4();
}

/**
 * Generate a unique game ID
 */
export function generateGameId(): string {
  return uuidv4();
}

/**
 * Calculate score for a correct answer based on difficulty and time remaining
 */
export function calculateScore(
  isCorrect: boolean, 
  difficulty: Question['difficulty'], 
  timeRemaining: number, 
  timeLimit: number,
  currentStreak: number = 0
): number {
  if (!isCorrect) return 0;
  
  const basePoints = scoringConfig.basePoints[difficulty];
  const speedBonus = Math.floor((timeRemaining / timeLimit) * basePoints * scoringConfig.speedBonusMultiplier);
  
  // Streak bonus
  let streakBonus = 0;
  if (currentStreak >= 10) streakBonus = scoringConfig.streakBonus[10];
  else if (currentStreak >= 5) streakBonus = scoringConfig.streakBonus[5];
  else if (currentStreak >= 3) streakBonus = scoringConfig.streakBonus[3];
  
  return basePoints + speedBonus + streakBonus;
}

/**
 * Calculate player's current streak
 */
export function calculateStreak(answers: Answer[]): number {
  let streak = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].isCorrect) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Update player scores after a question
 */
export function updatePlayerScores(
  players: Player[], 
  question: Question, 
  playerAnswers: Map<string, { answer: number; timeRemaining: number }>
): Player[] {
  return players.map(player => {
    const playerAnswer = playerAnswers.get(player.id);
    if (!playerAnswer) return player;
    
    const isCorrect = playerAnswer.answer === question.correctAnswer;
    const currentStreak = calculateStreak(player.answers || []);
    const pointsEarned = calculateScore(
      isCorrect, 
      question.difficulty, 
      playerAnswer.timeRemaining, 
      question.timeLimit,
      currentStreak
    );
    
    const newAnswer: Answer = {
      questionId: question.id,
      selectedAnswer: playerAnswer.answer,
      timeRemaining: playerAnswer.timeRemaining,
      isCorrect,
      pointsEarned,
      submittedAt: new Date()
    };
    
    return {
      ...player,
      score: player.score + pointsEarned,
      answers: [...(player.answers || []), newAnswer]
    };
  });
}

/**
 * Generate final game results
 */
export function generateGameResults(game: GameSession): GameResults {
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
  
  // Calculate game statistics
  const allAnswers = game.players.flatMap(p => p.answers || []);
  const correctAnswers = allAnswers.filter(a => a.isCorrect);
  const answerTimes = allAnswers.map(a => game.settings.timePerQuestion - a.timeRemaining);
  
  const gameStats = {
    totalQuestions: game.questions.length,
    averageAccuracy: allAnswers.length > 0 ? (correctAnswers.length / allAnswers.length) * 100 : 0,
    fastestAnswer: answerTimes.length > 0 ? Math.min(...answerTimes) : 0,
    slowestAnswer: answerTimes.length > 0 ? Math.max(...answerTimes) : 0,
    totalPlayTime: game.finishedAt && game.startedAt ? 
      game.finishedAt.getTime() - game.startedAt.getTime() : 0
  };
  
  // Calculate individual player results
  const playerResults = sortedPlayers.map((player, index) => {
    const playerAnswers = player.answers || [];
    const correctCount = playerAnswers.filter(a => a.isCorrect).length;
    const avgTime = playerAnswers.length > 0 ? 
      playerAnswers.reduce((sum, a) => sum + (game.settings.timePerQuestion - a.timeRemaining), 0) / playerAnswers.length : 0;
    
    return {
      playerId: player.id,
      finalScore: player.score,
      rank: index + 1,
      correctAnswers: correctCount,
      averageTime: avgTime,
      accuracy: playerAnswers.length > 0 ? (correctCount / playerAnswers.length) * 100 : 0
    };
  });
  
  return {
    gameId: game.id,
    finalLeaderboard: sortedPlayers,
    gameStats,
    playerResults
  };
}

/**
 * Validate game code format
 */
export function isValidGameCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}

/**
 * Validate nickname
 */
export function isValidNickname(nickname: string): boolean {
  return nickname.length >= 2 && nickname.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(nickname);
}

/**
 * Check if game is full
 */
export function isGameFull(game: GameSession): boolean {
  return game.players.length >= game.settings.maxPlayers;
}

/**
 * Check if player can join game
 */
export function canPlayerJoinGame(game: GameSession, nickname: string): { canJoin: boolean; reason?: string } {
  if (game.status !== 'waiting') {
    return { canJoin: false, reason: 'Game has already started' };
  }
  
  if (isGameFull(game)) {
    return { canJoin: false, reason: 'Game is full' };
  }
  
  if (game.players.some(p => p.nickname.toLowerCase() === nickname.toLowerCase())) {
    return { canJoin: false, reason: 'Nickname already taken' };
  }
  
  return { canJoin: true };
}

/**
 * Get next question or null if game is finished
 */
export function getNextQuestion(game: GameSession): Question | null {
  if (game.currentQuestionIndex >= game.questions.length) {
    return null;
  }
  return game.questions[game.currentQuestionIndex];
}

/**
 * Check if all players have answered
 */
export function haveAllPlayersAnswered(
  players: Player[], 
  questionId: string
): boolean {
  return players.every(player => 
    player.answers?.some(answer => answer.questionId === questionId)
  );
}

/**
 * Get player by ID
 */
export function getPlayerById(players: Player[], playerId: string): Player | null {
  return players.find(p => p.id === playerId) || null;
}

/**
 * Remove player from game
 */
export function removePlayerFromGame(game: GameSession, playerId: string): GameSession {
  return {
    ...game,
    players: game.players.filter(p => p.id !== playerId)
  };
}

/**
 * Check if player is host
 */
export function isPlayerHost(game: GameSession, playerId: string): boolean {
  return game.hostId === playerId;
}

/**
 * Generate lobby name from host nickname
 */
export function generateLobbyName(hostNickname: string): string {
  return `${hostNickname}'s Battle Room`;
}