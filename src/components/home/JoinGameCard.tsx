'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface JoinGameCardProps {
  gameCode: string;
  nickname: string;
  onGameCodeChange: (value: string) => void;
  onNicknameChange: (value: string) => void;
  onJoin: () => void;
}

export const JoinGameCard: React.FC<JoinGameCardProps> = ({
  gameCode,
  nickname,
  onGameCodeChange,
  onNicknameChange,
  onJoin
}) => {
  return (
    <Card className="flex flex-col items-center text-center">
      <div className="bg-truth-blue p-4 rounded-full mb-4 inline-block border-2 border-black">
        <span className="material-icons text-white text-5xl">play_arrow</span>
      </div>
      <h3 className="font-anton text-3xl mb-4">JOIN BATTLE</h3>
      <div className="w-full space-y-4">
        <Input 
          placeholder="ENTER GAME CODE"
          value={gameCode}
          onChange={onGameCodeChange}
          centered
          maxLength={6}
        />
        <Input 
          placeholder="YOUR BATTLE NAME"
          value={nickname}
          onChange={onNicknameChange}
          centered
          maxLength={20}
        />
        <Button 
          variant="orange" 
          icon="flash_on"
          onClick={onJoin}
          className="w-full"
          disabled={!gameCode || !nickname}
        >
          JOIN GAME NOW!
        </Button>
      </div>
    </Card>
  );
};