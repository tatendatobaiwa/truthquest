'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Player, Question } from '@/types';

interface GamePageProps {
  params: { gameId: string };
}

export default function GamePage({ params }: GamePageProps) {
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname');
  const isHost = searchParams.get('host') === 'true';
  
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', nickname: 'FactCrusader', score: 0, isHost: true },
    { id: '2', nickname: 'LogicLeaper', score: 1250 },
    { id: '3', nickname: 'InfoNinja', score: 980 },
    { id: '4', nickname: nickname || 'Player', score: 0 }
  ]);
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Sample question for demo
  const sampleQuestion: Question = {
    id: '1',
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
    tags: ['fact-checking', 'social-media', 'verification']
  };
  
  useEffect(() => {
    if (gameState === 'playing' && !currentQuestion) {
      setCurrentQuestion(sampleQuestion);
    }
  }, [gameState]);
  
  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0 && !selectedAnswer) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showResults) {
      handleTimeUp();
    }
  }, [timeRemaining, gameState, selectedAnswer, showResults]);
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setTimeout(() => {
      setShowResults(true);
    }, 1000);
  };
  
  const handleTimeUp = () => {
    setShowResults(true);
  };
  
  const startGame = () => {
    setGameState('playing');
    setTimeRemaining(30);
  };
  
  const getAnswerColor = (index: number): 'yellow' | 'green' | 'orange' | 'blue' => {
    const colors: ('yellow' | 'green' | 'orange' | 'blue')[] = ['yellow', 'green', 'orange', 'blue'];
    return colors[index];
  };
  
  if (gameState === 'lobby') {
    return (
      <main className="main-container">
        <Card className="max-w-4xl mx-auto text-center">
          <h2 className="font-anton text-6xl mb-4">GAME LOBBY</h2>
          <div className="bg-truth-yellow p-4 border-4 border-black inline-block mb-8">
            <span className="font-anton text-4xl">{params.gameId}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {players.map(player => (
              <div key={player.id} className="bg-gray-100 border-2 border-black rounded p-4">
                <div className="font-bold">{player.nickname}</div>
                {player.isHost && <div className="text-green-500 font-anton">HOST</div>}
              </div>
            ))}
          </div>
          
          {isHost && (
            <Button variant="green" onClick={startGame} size="lg">
              START BATTLE!
            </Button>
          )}
          
          {!isHost && (
            <p className="text-xl font-bold">Waiting for host to start the game...</p>
          )}
        </Card>
      </main>
    );
  }
  
  if (gameState === 'playing') {
    return (
      <main className="main-container">
        <Card className="max-w-4xl mx-auto">
          {/* Timer */}
          <div className="text-center mb-8">
            <div className="bg-red-500 text-white p-4 rounded-full inline-block border-4 border-black">
              <span className="font-anton text-4xl">{timeRemaining}</span>
            </div>
          </div>
          
          {/* Question */}
          {currentQuestion && (
            <>
              <h2 className="font-anton text-3xl text-center mb-8">
                {currentQuestion.text}
              </h2>
              
              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={getAnswerColor(index)}
                    onClick={() => handleAnswerSelect(index)}
                    className={`p-6 text-lg h-auto ${
                      selectedAnswer === index ? 'ring-4 ring-black' : ''
                    }`}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              
              {/* Results */}
              {showResults && (
                <div className="border-t-4 border-black pt-8">
                  <div className="text-center mb-6">
                    <h3 className="font-anton text-2xl mb-4">
                      {selectedAnswer === currentQuestion.correctAnswer ? 'CORRECT!' : 'INCORRECT!'}
                    </h3>
                    <p className="text-lg mb-4">
                      <strong>Correct Answer:</strong> {currentQuestion.options[currentQuestion.correctAnswer]}
                    </p>
                    <p className="text-gray-700 mb-4">{currentQuestion.explanation}</p>
                    <a 
                      href={currentQuestion.factCheckSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Source: {currentQuestion.factCheckSource.title} - {currentQuestion.factCheckSource.organization}
                    </a>
                  </div>
                  
                  <Button 
                    variant="green" 
                    onClick={() => setGameState('results')}
                    className="w-full"
                  >
                    CONTINUE TO RESULTS
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </main>
    );
  }
  
  // Results state
  return (
    <main className="main-container">
      <Card className="max-w-4xl mx-auto text-center">
        <h2 className="font-anton text-6xl mb-8">BATTLE RESULTS</h2>
        
        <div className="space-y-4 mb-8">
          {players
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <div 
                key={player.id}
                className={`flex justify-between items-center p-4 border-2 border-black rounded ${
                  index === 0 ? 'bg-truth-yellow' : 
                  index === 1 ? 'bg-gray-300' : 
                  index === 2 ? 'bg-orange-300' : 'bg-white'
                }`}
              >
                <div className="flex items-center">
                  <span className="font-anton text-2xl mr-4">#{index + 1}</span>
                  <span className="font-bold">{player.nickname}</span>
                </div>
                <span className="font-anton text-xl">{player.score}</span>
              </div>
            ))}
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button variant="green" onClick={() => window.location.href = '/'}>
            PLAY AGAIN
          </Button>
          <Button variant="blue" onClick={() => window.location.href = '/leaderboard'}>
            VIEW LEADERBOARD
          </Button>
        </div>
      </Card>
    </main>
  );
}