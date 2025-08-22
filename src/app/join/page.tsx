'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { PublicGame } from '@/types';

export default function JoinGamesPage() {
  const router = useRouter();
  const [publicGames, setPublicGames] = useState<PublicGame[]>([]);
  const [loading, setLoading] = useState(true);
  
  const loadPublicGames = async () => {
    setLoading(true);
    try {
      const { apiClient } = await import('@/lib/api');
      const games = await apiClient.getPublicGames();
      setPublicGames(games);
    } catch (error) {
      console.error('Failed to load public games:', error);
      // Keep empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicGames();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadPublicGames, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const handleJoinGame = async (gameId: string) => {
    const nickname = prompt('Enter your battle name:');
    if (!nickname) return;
    
    try {
      console.log('Joining game:', { gameId, nickname });
      router.push(`/game/${gameId}?nickname=${encodeURIComponent(nickname)}`);
    } catch (error) {
      console.error('Failed to join game:', error);
      alert('Failed to join game. Please try again.');
    }
  };
  
  return (
    <main className="main-container">
      <Card className="max-w-4xl mx-auto">
        <h2 className="font-anton text-4xl mb-6 text-center">JOIN A PUBLIC GAME</h2>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Available Games</h3>
          <Button 
            variant="yellow" 
            icon="refresh" 
            onClick={loadPublicGames}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh List'}
          </Button>
        </div>
        
        <div className="border-2 border-black rounded-lg h-96 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4">Loading games...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {publicGames.map((game) => (
                <div key={game.id} className="game-list-item">
                  <div>
                    <p className="font-bold text-lg">{game.name}</p>
                    <p className="text-sm text-gray-600">Question Pack: {game.questionPack}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">Players</p>
                    <p className="text-lg">{game.playerCount}/{game.maxPlayers}</p>
                  </div>
                  <Button 
                    variant={game.playerCount >= game.maxPlayers ? 'yellow' : 'green'}
                    onClick={() => handleJoinGame(game.id)}
                    disabled={game.playerCount >= game.maxPlayers}
                  >
                    {game.playerCount >= game.maxPlayers ? 'FULL' : 'JOIN'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </main>
  );
}