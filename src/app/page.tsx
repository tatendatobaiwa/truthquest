'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JoinGameCard } from '@/components/home/JoinGameCard';
import { HostGameCard } from '@/components/home/HostGameCard';
import { SoloPlayCard } from '@/components/home/SoloPlayCard';
import { FeatureGrid } from '@/components/home/FeatureGrid';

export default function HomePage() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [nickname, setNickname] = useState('');
  
  const handleJoinGame = async () => {
    if (!gameCode || !nickname) return;
    
    try {
      const { apiClient } = await import('@/lib/api');
      const response = await apiClient.joinGame(gameCode.toUpperCase(), nickname);
      
      // Store player info in localStorage for the game session
      localStorage.setItem('truthquest_player', JSON.stringify({
        playerId: response.playerId,
        nickname: nickname,
        gameId: response.gameSession.id
      }));
      
      router.push(`/game/${response.gameSession.id}?playerId=${response.playerId}`);
    } catch (error: any) {
      console.error('Failed to join game:', error);
      alert(error.message || 'Failed to join game. Please check the game code and try again.');
    }
  };
  
  return (
    <main className="main-container">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <div className="bg-truth-pink text-white p-8 border-4 border-black font-anton transform -rotate-2 max-w-lg">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-full border-4 border-truth-pink">
              <span className="material-icons text-truth-pink text-5xl">gps_fixed</span>
            </div>
            <h2 className="text-6xl mt-8">READY TO</h2>
            <h2 className="text-6xl">BATTLE LIES?</h2>
          </div>
        </div>
        <p className="mt-8 text-xl max-w-2xl mx-auto font-bold">
          Test your skills against misinformation, fake news, and digital deception in this high-energy quiz battle!
        </p>
      </div>
      
      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-12 mb-12">
        <JoinGameCard 
          gameCode={gameCode}
          nickname={nickname}
          onGameCodeChange={setGameCode}
          onNicknameChange={setNickname}
          onJoin={handleJoinGame}
        />
        <HostGameCard />
        <SoloPlayCard />
      </div>
      
      {/* Feature Grid */}
      <FeatureGrid />
    </main>
  );
}