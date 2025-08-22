import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '@/data/store';
import { 
  generateGameCode, 
  generateGameId, 
  generatePlayerId,
  isValidGameCode,
  isValidNickname,
  canPlayerJoinGame,
  generateLobbyName
} from '@/utils/gameUtils';
import { GameSession, Player, APIResponse, CreateGameResponse, JoinGameResponse } from '@/types';

const router = express.Router();

/**
 * POST /api/games/create
 * Create a new game session
 */
router.post('/create', (req, res) => {
  try {
    const { settings, hostNickname } = req.body;

    if (!hostNickname || !isValidNickname(hostNickname)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid host nickname'
      } as APIResponse);
    }

    // Generate unique identifiers
    const gameId = generateGameId();
    const gameCode = generateGameCode();
    const hostId = generatePlayerId();
    const hostToken = uuidv4();

    // Create host player
    const hostPlayer: Player = {
      id: hostId,
      nickname: hostNickname,
      score: 0,
      isHost: true,
      joinedAt: new Date()
    };

    // Get questions for the game
    const questions = dataStore.getRandomQuestions(
      settings.questionCount,
      { category: settings.questionPack === 'general' ? undefined : settings.questionPack }
    );

    if (questions.length < settings.questionCount) {
      return res.status(400).json({
        success: false,
        error: 'Not enough questions available for selected category'
      } as APIResponse);
    }

    // Create game session
    const gameSession: GameSession = {
      id: gameId,
      gameCode,
      hostId,
      status: 'waiting',
      players: [hostPlayer],
      questions,
      currentQuestionIndex: 0,
      settings: {
        questionPack: settings.questionPack || 'general',
        questionCount: settings.questionCount || 20,
        timePerQuestion: settings.timePerQuestion || 30,
        visibility: settings.visibility || 'public',
        maxPlayers: settings.maxPlayers || 16,
        allowLateJoin: settings.allowLateJoin || false
      },
      createdAt: new Date()
    };

    // Store the game
    dataStore.createGame(gameSession);

    const response: CreateGameResponse = {
      gameId,
      gameCode,
      hostToken
    };

    res.json({
      success: true,
      data: response
    } as APIResponse<CreateGameResponse>);

  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create game'
    } as APIResponse);
  }
});

/**
 * POST /api/games/join
 * Join an existing game
 */
router.post('/join', (req, res) => {
  try {
    const { gameCode, nickname } = req.body;

    if (!gameCode || !isValidGameCode(gameCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid game code'
      } as APIResponse);
    }

    if (!nickname || !isValidNickname(nickname)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid nickname'
      } as APIResponse);
    }

    // Find the game
    const game = dataStore.getGameByCode(gameCode);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      } as APIResponse);
    }

    // Check if player can join
    const { canJoin, reason } = canPlayerJoinGame(game, nickname);
    if (!canJoin) {
      return res.status(400).json({
        success: false,
        error: reason
      } as APIResponse);
    }

    // Create new player
    const playerId = generatePlayerId();
    const newPlayer: Player = {
      id: playerId,
      nickname,
      score: 0,
      joinedAt: new Date()
    };

    // Add player to game
    const updatedGame: GameSession = {
      ...game,
      players: [...game.players, newPlayer]
    };

    dataStore.updateGame(game.id, updatedGame);

    const response: JoinGameResponse = {
      playerId,
      gameSession: updatedGame
    };

    res.json({
      success: true,
      data: response
    } as APIResponse<JoinGameResponse>);

  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join game'
    } as APIResponse);
  }
});

/**
 * GET /api/games/public
 * Get list of public games
 */
router.get('/public', (req, res) => {
  try {
    const publicGames = dataStore.getPublicGames().map(game => ({
      id: game.id,
      name: generateLobbyName(game.players.find(p => p.isHost)?.nickname || 'Unknown'),
      hostName: game.players.find(p => p.isHost)?.nickname || 'Unknown',
      questionPack: game.settings.questionPack,
      playerCount: game.players.length,
      maxPlayers: game.settings.maxPlayers,
      status: game.status,
      createdAt: game.createdAt
    }));

    res.json({
      success: true,
      data: publicGames
    } as APIResponse);

  } catch (error) {
    console.error('Error fetching public games:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch public games'
    } as APIResponse);
  }
});

/**
 * GET /api/games/:gameId
 * Get game details
 */
router.get('/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const game = dataStore.getGame(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      } as APIResponse);
    }

    res.json({
      success: true,
      data: game
    } as APIResponse<GameSession>);

  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game'
    } as APIResponse);
  }
});

/**
 * POST /api/games/:gameId/start
 * Start a game (host only)
 */
router.post('/:gameId/start', (req, res) => {
  try {
    const { gameId } = req.params;
    const { hostToken } = req.body;

    const game = dataStore.getGame(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      } as APIResponse);
    }

    if (game.status !== 'waiting') {
      return res.status(400).json({
        success: false,
        error: 'Game has already started'
      } as APIResponse);
    }

    if (game.players.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Need at least 2 players to start'
      } as APIResponse);
    }

    // Update game status
    const updatedGame: GameSession = {
      ...game,
      status: 'in-progress',
      startedAt: new Date(),
      currentQuestionStartTime: new Date()
    };

    dataStore.updateGame(gameId, updatedGame);

    res.json({
      success: true,
      data: updatedGame
    } as APIResponse<GameSession>);

  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start game'
    } as APIResponse);
  }
});

/**
 * POST /api/games/:gameId/answer
 * Submit an answer to a question
 */
router.post('/:gameId/answer', (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId, questionId, answer, timeRemaining } = req.body;

    const game = dataStore.getGame(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      } as APIResponse);
    }

    if (game.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        error: 'Game is not in progress'
      } as APIResponse);
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Player not found'
      } as APIResponse);
    }

    const question = game.questions[game.currentQuestionIndex];
    if (!question || question.id !== questionId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question'
      } as APIResponse);
    }

    // Check if player already answered this question
    if (player.answers?.some(a => a.questionId === questionId)) {
      return res.status(400).json({
        success: false,
        error: 'Already answered this question'
      } as APIResponse);
    }

    res.json({
      success: true,
      message: 'Answer submitted successfully'
    } as APIResponse);

  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit answer'
    } as APIResponse);
  }
});

/**
 * DELETE /api/games/:gameId
 * Delete a game (host only)
 */
router.delete('/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const { hostToken } = req.body;

    const game = dataStore.getGame(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      } as APIResponse);
    }

    dataStore.deleteGame(gameId);

    res.json({
      success: true,
      message: 'Game deleted successfully'
    } as APIResponse);

  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete game'
    } as APIResponse);
  }
});

export default router;