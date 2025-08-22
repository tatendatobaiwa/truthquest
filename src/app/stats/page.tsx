'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function StatsPage() {
  const userStats = {
    username: 'TruthSeeker22',
    totalWins: 42,
    totalBattles: 117,
    winRate: 35,
    correctAnswers: 345,
    incorrectAnswers: 98,
    accuracy: 77.8,
    avgTimePerQuestion: 8.2
  };
  
  const battleHistory = [
    { mode: 'Team Battle', result: 'VICTORY', score: 1250, date: '2d ago', icon: 'groups', color: 'text-blue-500' },
    { mode: 'Solo Challenge', result: 'DEFEAT', score: 780, date: '4d ago', icon: 'person', color: 'text-purple-500' },
    { mode: 'Team Battle', result: 'VICTORY', score: 1500, date: '1w ago', icon: 'groups', color: 'text-blue-500' },
    { mode: 'Quick Match', result: 'DEFEAT', score: 950, date: '1w ago', icon: 'flash_on', color: 'text-orange-500' }
  ];
  
  return (
    <main className="main-container">
      <div className="text-center mb-10">
        <h2 className="font-anton text-6xl text-black">MY BATTLE STATS</h2>
        <p className="text-xl font-bold">
          Player: <span className="text-red-600">{userStats.username}</span>
        </p>
      </div>
      
      {/* Main Stats */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card variant="stat" className="bg-green-300">
          <div className="flex items-center justify-center mb-2">
            <span className="material-icons text-5xl text-green-800">emoji_events</span>
          </div>
          <p className="font-anton text-2xl">TOTAL WINS</p>
          <p className="font-anton text-6xl text-green-900">{userStats.totalWins}</p>
        </Card>
        
        <Card variant="stat" className="bg-orange-300">
          <div className="flex items-center justify-center mb-2">
            <span className="material-icons text-5xl text-orange-800">military_tech</span>
          </div>
          <p className="font-anton text-2xl">BATTLES FOUGHT</p>
          <p className="font-anton text-6xl text-orange-900">{userStats.totalBattles}</p>
        </Card>
        
        <Card variant="stat" className="bg-purple-300">
          <div className="flex items-center justify-center mb-2">
            <span className="material-icons text-5xl text-purple-800">percent</span>
          </div>
          <p className="font-anton text-2xl">WIN RATE</p>
          <p className="font-anton text-6xl text-purple-900">{userStats.winRate}<span className="text-5xl">%</span></p>
        </Card>
      </div>
      
      {/* Performance Breakdown */}
      <Card className="mb-12">
        <h3 className="font-anton text-3xl mb-4 text-center">Performance Breakdown</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 border-2 border-dashed border-gray-400 rounded-lg">
            <p className="font-bold text-gray-600 text-sm">CORRECT ANSWERS</p>
            <p className="font-anton text-4xl text-green-600">{userStats.correctAnswers}</p>
          </div>
          <div className="p-4 border-2 border-dashed border-gray-400 rounded-lg">
            <p className="font-bold text-gray-600 text-sm">INCORRECT ANSWERS</p>
            <p className="font-anton text-4xl text-red-600">{userStats.incorrectAnswers}</p>
          </div>
          <div className="p-4 border-2 border-dashed border-gray-400 rounded-lg">
            <p className="font-bold text-gray-600 text-sm">ACCURACY</p>
            <p className="font-anton text-4xl text-blue-600">{userStats.accuracy}%</p>
          </div>
          <div className="p-4 border-2 border-dashed border-gray-400 rounded-lg">
            <p className="font-bold text-gray-600 text-sm">AVG. TIME / Q</p>
            <p className="font-anton text-4xl text-yellow-600">{userStats.avgTimePerQuestion}s</p>
          </div>
        </div>
      </Card>
      
      {/* Battle History */}
      <Card>
        <h3 className="font-anton text-3xl mb-6 text-center">Recent Battle History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b-4 border-black">
              <tr>
                <th className="p-3 font-anton text-xl">Game Mode</th>
                <th className="p-3 font-anton text-xl">Result</th>
                <th className="p-3 font-anton text-xl">Score</th>
                <th className="p-3 font-anton text-xl">Date</th>
              </tr>
            </thead>
            <tbody>
              {battleHistory.map((battle, index) => (
                <tr key={index} className={`border-b-2 border-gray-300 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
                  <td className="p-3 font-bold flex items-center">
                    <span className={`material-icons mr-2 ${battle.color}`}>{battle.icon}</span>
                    {battle.mode}
                  </td>
                  <td className={`p-3 font-bold ${battle.result === 'VICTORY' ? 'text-green-600' : 'text-red-600'}`}>
                    {battle.result}
                  </td>
                  <td className="p-3 font-bold">{battle.score} pts</td>
                  <td className="p-3 font-bold">{battle.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}