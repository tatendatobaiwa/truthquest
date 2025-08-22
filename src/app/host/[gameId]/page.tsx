'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { Player, GameSettings } from '@/types';

interface HostLobbyPageProps {
  params: { gameId: string };
}

export default function HostLobbyPage({ params }: HostLobbyPageProps) {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', nickname: 'FactCrusader', score: 0, isHost: true },
    { id: '2', nickname: 'LogicLeaper', score: 0 },
    { id: '3', nickname: 'InfoNinja', score: 0 },
    { id: '4', nickname: 'DataDetective', score: 0 }
  ]);
  
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    questionPack: 'current-events-2024',
    questionCount: 20,
    timePerQuestion: 30,
    visibility: 'public',
    maxPlayers: 16
  });
  
  const [isLocked, setIsLocked] = useState(false);
  
  const questionPackOptions = [
    { value: 'current-events-2024', label: 'Current Events 2024' },
    { value: 'social-media-myths', label: 'Social Media Myths' },
    { value: 'historical-hoaxes', label: 'Historical Hoaxes' }
  ];
  
  const handleStartGame = () => {
    if (players.length < 2) {
      alert('Need at least 2 players to start the game!');
      return;
    }
    
    // Redirect to game interface
    router.push(`/game/${params.gameId}?host=true`);
  };
  
  const handleKickPlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(params.gameId);
    alert('Game code copied to clipboard!');
  };
  
  const handleShareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my TruthQuest game!',
        text: `Join my TruthQuest battle with code: ${params.gameId}`,
        url: window.location.href
      });
    } else {
      handleCopyCode();
    }
  };
  
  return (
    <main className="main-container">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Game Code Display */}
          <Card className="mb-8">
            <h2 className="font-anton text-4xl mb-4 text-center lg:text-left">HOST BATTLE LOBBY</h2>
            <div className="bg-gray-100 border-2 border-black rounded p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="font-bold">GAME CODE:</p>
                <p className="font-anton text-5xl text-truth-pink">{params.gameId}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="blue" icon="content_copy" onClick={handleCopyCode}>
                  COPY
                </Button>
                <Button variant="yellow" icon="share" onClick={handleShareCode}>
                  SHARE
                </Button>
              </div>
              <Button 
                variant="green" 
                icon="play_arrow"
                onClick={handleStartGame}
                className="w-full md:w-auto"
                disabled={players.length < 2}
              >
                START GAME
              </Button>
            </div>
          </Card>
          
          {/* Players List */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-anton text-3xl">PLAYERS ({players.length}/{gameSettings.maxPlayers})</h3>
              <div className="flex items-center space-x-2">
                <span className="material-icons">lock</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                    id="toggle" 
                    name="toggle" 
                    type="checkbox"
                    checked={isLocked}
                    onChange={(e) => setIsLocked(e.target.checked)}
                  />
                  <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer" htmlFor="toggle"></label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="bg-gray-100 border-2 border-black rounded p-3 flex justify-between items-center">
                  <span className="font-bold">{player.nickname}</span>
                  <div className="flex items-center">
                    {player.isHost && (
                      <span className="font-anton text-green-500 mr-2">HOST</span>
                    )}
                    {!player.isHost && (
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleKickPlayer(player.id)}
                      >
                        <span className="material-icons">highlight_off</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 6 - players.length) }).map((_, index) => (
                <div key={`empty-${index}`} className="bg-gray-200 border-2 border-dashed border-black rounded p-3 text-center text-gray-500">
                  <span>Waiting for player...</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Game Settings Panel */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-anton text-3xl mb-4 text-center">GAME SETTINGS</h3>
            <div className="space-y-6">
              <div>
                <label className="font-bold mb-2 block">QUESTION PACK</label>
                <Select
                  options={questionPackOptions}
                  value={gameSettings.questionPack}
                  onChange={(value) => setGameSettings(prev => ({ ...prev, questionPack: value }))}
                />
              </div>
              
              <div>
                <label className="font-bold mb-2 block">NUMBER OF QUESTIONS</label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 30].map((count) => (
                    <Button
                      key={count}
                      variant={gameSettings.questionCount === count ? 'yellow' : 'gray'}
                      onClick={() => setGameSettings(prev => ({ ...prev, questionCount: count as 10 | 20 | 30 }))}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="font-bold mb-2 block">TIME PER QUESTION</label>
                <div className="grid grid-cols-3 gap-2">
                  {[20, 30, 45].map((time) => (
                    <Button
                      key={time}
                      variant={gameSettings.timePerQuestion === time ? 'yellow' : 'gray'}
                      onClick={() => setGameSettings(prev => ({ ...prev, timePerQuestion: time as 20 | 30 | 45 }))}
                    >
                      {time}s
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="font-bold mb-2 block">GAME VISIBILITY</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={gameSettings.visibility === 'public' ? 'yellow' : 'gray'}
                    icon="public"
                    onClick={() => setGameSettings(prev => ({ ...prev, visibility: 'public' }))}
                  >
                    Public
                  </Button>
                  <Button
                    variant={gameSettings.visibility === 'private' ? 'yellow' : 'gray'}
                    icon="lock"
                    onClick={() => setGameSettings(prev => ({ ...prev, visibility: 'private' }))}
                  >
                    Private
                  </Button>
                </div>
              </div>
              
              <Button variant="orange" icon="settings" className="w-full">
                ADVANCED SETTINGS
              </Button>
              
              <Button variant="red" icon="cancel" className="w-full">
                END LOBBY
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}