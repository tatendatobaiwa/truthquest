'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import type { LeaderboardTab, LeaderboardEntry } from '@/types';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('friends');
  
  const tabs: LeaderboardTab[] = ['friends', 'local', 'global', 'daily', 'weekly', 'monthly'];
  
  const sampleLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: '1', username: 'TruthSlayer99', avatar: '/avatars/1.jpg', score: 15430 },
    { rank: 2, userId: '2', username: 'FactCheckerPro', avatar: '/avatars/2.jpg', score: 14980 },
    { rank: 3, userId: '3', username: 'Misinfo-Buster', avatar: '/avatars/3.jpg', score: 14210 },
    { rank: 4, userId: '4', username: 'NewsNinja', avatar: '/avatars/4.jpg', score: 13850 },
    { rank: 5, userId: '5', username: 'VeritasSeeker', avatar: '/avatars/5.jpg', score: 13500 },
    { rank: 98, userId: 'current', username: 'TheDebunker', avatar: '/avatars/current.jpg', score: 8120, isCurrentUser: true }
  ];
  
  return (
    <main className="main-container">
      <div className="text-center mb-12">
        <div className="inline-block bg-white p-4 rounded-full border-4 border-black shadow-lg">
          <span className="material-icons text-truth-yellow text-6xl">emoji_events</span>
        </div>
        <h2 className="font-anton text-6xl mt-4">LEADERBOARD</h2>
        <p className="text-xl font-bold">See who's the ultimate truth seeker!</p>
      </div>
      
      <Card>
        {/* Tabs */}
        <div className="flex flex-wrap justify-center border-b-2 border-black -mt-8 mx-[-2rem] px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Leaderboard Table */}
        <div className="mt-6">
          <div className="hidden md:flex font-bold text-lg p-3 bg-gray-200 border-b-4 border-black">
            <div className="w-1/6 text-center">Rank</div>
            <div className="w-3/6">Player</div>
            <div className="w-2/6 text-right">Score</div>
          </div>
          
          {sampleLeaderboard.map((entry) => (
            <div 
              key={entry.userId}
              className={`leaderboard-row ${
                entry.isCurrentUser ? 'bg-blue-200 border-t-4 border-blue-500 mt-4' : ''
              }`}
            >
              <div className="w-1/6 font-anton text-4xl text-center">{entry.rank}</div>
              <div className="w-3/6 flex items-center">
                <div className={`w-10 h-10 rounded-full mr-4 border-2 ${
                  entry.isCurrentUser ? 'border-blue-500' : 'border-black'
                } bg-gray-300 flex items-center justify-center`}>
                  <span className="material-icons text-gray-600">person</span>
                </div>
                <span className={`font-bold text-lg ${
                  entry.isCurrentUser ? 'text-blue-800' : ''
                }`}>
                  {entry.isCurrentUser ? `You (${entry.username})` : entry.username}
                </span>
              </div>
              <div className={`w-2/6 text-right font-bold text-xl ${
                entry.isCurrentUser ? 'text-blue-800' : ''
              }`}>
                {entry.score.toLocaleString()} pts
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}