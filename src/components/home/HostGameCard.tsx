'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const HostGameCard: React.FC = () => {
  const router = useRouter();
  
  const handleHostGame = () => {
    router.push('/host');
  };
  
  return (
    <Card className="flex flex-col items-center text-center">
      <div className="bg-truth-pink p-4 rounded-full mb-4 inline-block border-2 border-black">
        <span className="material-icons text-white text-5xl">groups</span>
      </div>
      <h3 className="font-anton text-3xl mb-4">HOST BATTLE</h3>
      <p className="mb-6">Create a game room and challenge friends to spot fake news!</p>
      <Button 
        variant="green" 
        icon="add_circle_outline"
        onClick={handleHostGame}
        className="w-full"
      >
        START HOSTING!
      </Button>
    </Card>
  );
};