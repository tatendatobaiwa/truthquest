'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { GameSettings } from '@/types';

export default function HostPage() {
  const router = useRouter();
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    questionPack: 'current-events-2024',
    questionCount: 20,
    timePerQuestion: 30,
    visibility: 'public',
    maxPlayers: 16
  });
  
  const questionPackOptions = [
    { value: 'current-events-2024', label: 'Current Events 2024' },
    { value: 'social-media-myths', label: 'Social Media Myths' },
    { value: 'historical-hoaxes', label: 'Historical Hoaxes' },
    { value: 'health-misinformation', label: 'Health Misinformation' },
    { value: 'financial-scams', label: 'Financial Scams' }
  ];
  
  const createGame = async () => {
    const hostNickname = prompt('Enter your host nickname:');
    if (!hostNickname) return;
    
    try {
      const { apiClient } = await import('@/lib/api');
      const response = await apiClient.createGame(gameSettings, hostNickname);
      
      // Store host info in localStorage
      localStorage.setItem('truthquest_host', JSON.stringify({
        gameId: response.gameId,
        hostToken: response.hostToken,
        nickname: hostNickname
      }));
      
      router.push(`/host/${response.gameId}`);
    } catch (error: any) {
      console.error('Failed to create game:', error);
      alert(error.message || 'Failed to create game. Please try again.');
    }
  };
  
  return (
    <main className="main-container">
      <Card className="max-w-2xl mx-auto">
        <h2 className="font-anton text-4xl text-center mb-8">CREATE BATTLE ROOM</h2>
        
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
          
          <Button 
            variant="green" 
            icon="add_circle_outline"
            onClick={createGame}
            className="w-full"
            size="lg"
          >
            CREATE GAME ROOM
          </Button>
        </div>
      </Card>
    </main>
  );
}