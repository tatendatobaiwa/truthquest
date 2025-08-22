import { Server, Socket } from 'socket.io';
import { dataStore } from '@/data/store';
import { 
  updatePlayerScores, 
  generateGameResults, 
  getNextQuestion, 
  haveAllPlayersAnswered,
  removePlayerFromGame,
  isPlayerHost
} from '@/utils/gameUtils';
import { GameSession, Player, Question, SocketEvents } from '@/types';

export class GameSocketHandler {
  private io: Server;
  private playerSockets: Map<string, string> = new Map(); // playerId -> socketId
  private socketPlayers: Map<string, string> = new Map(); // socketId -> playerId
  private gameRooms: Map<string, Set<string>> = new Map(); // gameId -> Set<socketId>
  private questionTimers: Map<string, NodeJS.Timeout> = new Map(); // gameId -> timer
  private playerAnswers: Map<string, Map<string, { answer: number; timeRemaining: number }>> = new Map(); // gameId -> playerId -> answer

  constructor(io: Server) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Join host lobby
      socket.on('join-host-lobby', (data: { gameId: string; hostToken: string }) => {
        this.handleJoinHostLobby(socket, data);
      });

      // Join player lobby
      socket.on('join-player-lobby', (data: { gameId: string; playerId: string }) => {
        this.handleJoinPlayerLobby(socket, data);
      });

      // Start game
      socket.on('start-game', (data: { gameId: string; settings: any }) => {
        this.handleStartGame(socket, data);
      });

      // Submit answer
      socket.on('submit-answer', (data: { playerId: string; questionId: string; answer: number; timeRemaining: number }) => {
        this.handleSubmitAnswer(socket, data);
      });

      // Kick player
      socket.on('kick-player', (data: { gameId: string; playerId: string }) => {
        this.handleKickPlayer(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleJoinHostLobby(socket: Socket, data: { gameId: string; hostToken: string }) {
    try {
      const game = dataStore.getGame(data.gameId);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const host = game.players.find(p => p.isHost);
      if (!host) {
        socket.emit('error', { message: 'Host not found' });
        return;
      }

      // Join the game room
      socket.join(data.gameId);
      this.addSocketToGameRoom(data.gameId, socket.id);
      this.playerSockets.set(host.id, socket.id);
      this.socketPlayers.set(socket.id, host.id);

      // Update host's socket ID
      const updatedPlayers = game.players.map(p => 
        p.isHost ? { ...p, socketId: socket.id } : p
      );
      
      const updatedGame = { ...game, players: updatedPlayers };
      dataStore.updateGame(data.gameId, updatedGame);

      // Send current game state
      socket.emit('lobby-updated', {
        players: updatedGame.players,
        settings: updatedGame.settings
      });

      console.log(`Host ${host.nickname} joined lobby for game ${data.gameId}`);
    } catch (error) {
      console.error('Error in join-host-lobby:', error);
      socket.emit('error', { message: 'Failed to join lobby' });
    }
  }

  private handleJoinPlayerLobby(socket: Socket, data: { gameId: string; playerId: string }) {
    try {
      const game = dataStore.getGame(data.gameId);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const player = game.players.find(p => p.id === data.playerId);
      if (!player) {
        socket.emit('error', { message: 'Player not found' });
        return;
      }

      // Join the game room
      socket.join(data.gameId);
      this.addSocketToGameRoom(data.gameId, socket.id);
      this.playerSockets.set(data.playerId, socket.id);
      this.socketPlayers.set(socket.id, data.playerId);

      // Update player's socket ID
      const updatedPlayers = game.players.map(p => 
        p.id === data.playerId ? { ...p, socketId: socket.id } : p
      );
      
      const updatedGame = { ...game, players: updatedPlayers };
      dataStore.updateGame(data.gameId, updatedGame);

      // Notify all players in the lobby
      this.io.to(data.gameId).emit('player-joined', player);
      this.io.to(data.gameId).emit('lobby-updated', {
        players: updatedGame.players,
        settings: updatedGame.settings
      });

      console.log(`Player ${player.nickname} joined lobby for game ${data.gameId}`);
    } catch (error) {
      console.error('Error in join-player-lobby:', error);
      socket.emit('error', { message: 'Failed to join lobby' });
    }
  }

  private handleStartGame(socket: Socket, data: { gameId: string; settings: any }) {
    try {
      const game = dataStore.getGame(data.gameId);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const playerId = this.socketPlayers.get(socket.id);
      if (!playerId || !isPlayerHost(game, playerId)) {
        socket.emit('error', { message: 'Only host can start the game' });
        return;
      }

      if (game.status !== 'waiting') {
        socket.emit('error', { message: 'Game has already started' });
        return;
      }

      if (game.players.length < 2) {
        socket.emit('error', { message: 'Need at least 2 players to start' });
        return;
      }

      // Update game status
      const updatedGame: GameSession = {
        ...game,
        status: 'in-progress',
        startedAt: new Date(),
        currentQuestionStartTime: new Date()
      };

      dataStore.updateGame(data.gameId, updatedGame);

      // Start the first question
      this.startQuestion(data.gameId);

      console.log(`Game ${data.gameId} started by host`);
    } catch (error) {
      console.error('Error in start-game:', error);
      socket.emit('error', { message: 'Failed to start game' });
    }
  }

  private handleSubmitAnswer(socket: Socket, data: { playerId: string; questionId: string; answer: number; timeRemaining: number }) {
    try {
      const playerId = this.socketPlayers.get(socket.id);
      if (!playerId || playerId !== data.playerId) {
        socket.emit('error', { message: 'Invalid player' });
        return;
      }

      // Find the game this player is in
      let gameId: string | null = null;
      for (const [gId, socketSet] of this.gameRooms.entries()) {
        if (socketSet.has(socket.id)) {
          gameId = gId;
          break;
        }
      }

      if (!gameId) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const game = dataStore.getGame(gameId);
      if (!game || game.status !== 'in-progress') {
        socket.emit('error', { message: 'Game is not in progress' });
        return;
      }

      const currentQuestion = game.questions[game.currentQuestionIndex];
      if (!currentQuestion || currentQuestion.id !== data.questionId) {
        socket.emit('error', { message: 'Invalid question' });
        return;
      }

      // Store the answer
      if (!this.playerAnswers.has(gameId)) {
        this.playerAnswers.set(gameId, new Map());
      }
      
      const gameAnswers = this.playerAnswers.get(gameId)!;
      if (gameAnswers.has(data.playerId)) {
        socket.emit('error', { message: 'Already answered this question' });
        return;
      }

      gameAnswers.set(data.playerId, {
        answer: data.answer,
        timeRemaining: data.timeRemaining
      });

      // Notify all players that this player answered
      this.io.to(gameId).emit('answer-submitted', {
        playerId: data.playerId,
        answer: data.answer
      });

      // Check if all players have answered
      if (haveAllPlayersAnswered(game.players, data.questionId)) {
        this.endQuestion(gameId);
      }

      console.log(`Player ${data.playerId} submitted answer for question ${data.questionId}`);
    } catch (error) {
      console.error('Error in submit-answer:', error);
      socket.emit('error', { message: 'Failed to submit answer' });
    }
  }

  private handleKickPlayer(socket: Socket, data: { gameId: string; playerId: string }) {
    try {
      const game = dataStore.getGame(data.gameId);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const hostPlayerId = this.socketPlayers.get(socket.id);
      if (!hostPlayerId || !isPlayerHost(game, hostPlayerId)) {
        socket.emit('error', { message: 'Only host can kick players' });
        return;
      }

      const playerToKick = game.players.find(p => p.id === data.playerId);
      if (!playerToKick || playerToKick.isHost) {
        socket.emit('error', { message: 'Cannot kick this player' });
        return;
      }

      // Remove player from game
      const updatedGame = removePlayerFromGame(game, data.playerId);
      dataStore.updateGame(data.gameId, updatedGame);

      // Disconnect the kicked player
      const kickedSocketId = this.playerSockets.get(data.playerId);
      if (kickedSocketId) {
        const kickedSocket = this.io.sockets.sockets.get(kickedSocketId);
        if (kickedSocket) {
          kickedSocket.emit('player-kicked', { playerId: data.playerId });
          kickedSocket.leave(data.gameId);
        }
        this.removePlayerFromMaps(data.playerId, kickedSocketId);
      }

      // Notify remaining players
      this.io.to(data.gameId).emit('player-left', { playerId: data.playerId });
      this.io.to(data.gameId).emit('lobby-updated', {
        players: updatedGame.players,
        settings: updatedGame.settings
      });

      console.log(`Player ${data.playerId} was kicked from game ${data.gameId}`);
    } catch (error) {
      console.error('Error in kick-player:', error);
      socket.emit('error', { message: 'Failed to kick player' });
    }
  }

  private handleDisconnect(socket: Socket) {
    try {
      const playerId = this.socketPlayers.get(socket.id);
      if (!playerId) return;

      // Find the game this player was in
      let gameId: string | null = null;
      for (const [gId, socketSet] of this.gameRooms.entries()) {
        if (socketSet.has(socket.id)) {
          gameId = gId;
          break;
        }
      }

      if (gameId) {
        const game = dataStore.getGame(gameId);
        if (game) {
          const player = game.players.find(p => p.id === playerId);
          if (player) {
            // If host disconnects, end the game
            if (player.isHost) {
              this.endGame(gameId, 'Host disconnected');
            } else {
              // Remove player from game
              const updatedGame = removePlayerFromGame(game, playerId);
              dataStore.updateGame(gameId, updatedGame);

              // Notify remaining players
              this.io.to(gameId).emit('player-left', { playerId });
              this.io.to(gameId).emit('lobby-updated', {
                players: updatedGame.players,
                settings: updatedGame.settings
              });
            }
          }
        }

        this.removeSocketFromGameRoom(gameId, socket.id);
      }

      this.removePlayerFromMaps(playerId, socket.id);
      console.log(`Socket disconnected: ${socket.id}, Player: ${playerId}`);
    } catch (error) {
      console.error('Error in disconnect:', error);
    }
  }

  private startQuestion(gameId: string) {
    const game = dataStore.getGame(gameId);
    if (!game) return;

    const question = getNextQuestion(game);
    if (!question) {
      this.endGame(gameId);
      return;
    }

    // Clear previous answers
    this.playerAnswers.set(gameId, new Map());

    // Send question to all players
    this.io.to(gameId).emit('question-displayed', {
      question: {
        ...question,
        correctAnswer: undefined // Don't send correct answer to clients
      },
      questionNumber: game.currentQuestionIndex + 1,
      timeLimit: question.timeLimit
    });

    // Set timer for question timeout
    const timer = setTimeout(() => {
      this.endQuestion(gameId);
    }, question.timeLimit * 1000 + 2000); // Add 2 second buffer

    this.questionTimers.set(gameId, timer);

    console.log(`Question ${game.currentQuestionIndex + 1} started for game ${gameId}`);
  }

  private endQuestion(gameId: string) {
    const game = dataStore.getGame(gameId);
    if (!game) return;

    // Clear question timer
    const timer = this.questionTimers.get(gameId);
    if (timer) {
      clearTimeout(timer);
      this.questionTimers.delete(gameId);
    }

    const currentQuestion = game.questions[game.currentQuestionIndex];
    const gameAnswers = this.playerAnswers.get(gameId) || new Map();

    // Update player scores
    const updatedPlayers = updatePlayerScores(game.players, currentQuestion, gameAnswers);

    // Prepare player answers for results
    const playerAnswers = Array.from(gameAnswers.entries()).map(([playerId, answerData]) => ({
      playerId,
      answer: answerData.answer,
      isCorrect: answerData.answer === currentQuestion.correctAnswer,
      pointsEarned: updatedPlayers.find(p => p.id === playerId)?.score || 0
    }));

    // Update game
    const updatedGame: GameSession = {
      ...game,
      players: updatedPlayers,
      currentQuestionIndex: game.currentQuestionIndex + 1
    };

    dataStore.updateGame(gameId, updatedGame);

    // Send results to all players
    this.io.to(gameId).emit('question-results', {
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      factCheckSource: currentQuestion.factCheckSource,
      leaderboard: [...updatedPlayers].sort((a, b) => b.score - a.score),
      playerAnswers
    });

    // Start next question after delay or end game
    setTimeout(() => {
      if (updatedGame.currentQuestionIndex >= updatedGame.questions.length) {
        this.endGame(gameId);
      } else {
        this.startQuestion(gameId);
      }
    }, 5000); // 5 second delay between questions

    console.log(`Question ${game.currentQuestionIndex + 1} ended for game ${gameId}`);
  }

  private endGame(gameId: string, reason?: string) {
    const game = dataStore.getGame(gameId);
    if (!game) return;

    // Clear any remaining timers
    const timer = this.questionTimers.get(gameId);
    if (timer) {
      clearTimeout(timer);
      this.questionTimers.delete(gameId);
    }

    // Update game status
    const updatedGame: GameSession = {
      ...game,
      status: 'finished',
      finishedAt: new Date()
    };

    dataStore.updateGame(gameId, updatedGame);

    // Generate final results
    const finalResults = generateGameResults(updatedGame);

    // Send final results to all players
    this.io.to(gameId).emit('game-ended', { finalResults });

    // Clean up
    this.playerAnswers.delete(gameId);
    
    // Remove all sockets from game room after delay
    setTimeout(() => {
      const socketSet = this.gameRooms.get(gameId);
      if (socketSet) {
        socketSet.forEach(socketId => {
          const socket = this.io.sockets.sockets.get(socketId);
          if (socket) {
            socket.leave(gameId);
          }
        });
      }
      this.gameRooms.delete(gameId);
    }, 30000); // 30 seconds to view results

    console.log(`Game ${gameId} ended${reason ? ` (${reason})` : ''}`);
  }

  private addSocketToGameRoom(gameId: string, socketId: string) {
    if (!this.gameRooms.has(gameId)) {
      this.gameRooms.set(gameId, new Set());
    }
    this.gameRooms.get(gameId)!.add(socketId);
  }

  private removeSocketFromGameRoom(gameId: string, socketId: string) {
    const socketSet = this.gameRooms.get(gameId);
    if (socketSet) {
      socketSet.delete(socketId);
      if (socketSet.size === 0) {
        this.gameRooms.delete(gameId);
      }
    }
  }

  private removePlayerFromMaps(playerId: string, socketId: string) {
    this.playerSockets.delete(playerId);
    this.socketPlayers.delete(socketId);
  }

  // Public method to get statistics
  public getStats() {
    return {
      connectedSockets: this.io.sockets.sockets.size,
      activeGames: this.gameRooms.size,
      activePlayers: this.playerSockets.size
    };
  }
}