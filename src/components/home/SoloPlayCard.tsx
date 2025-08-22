'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export const SoloPlayCard: React.FC = () => {
  const router = useRouter();
  const [category, setCategory] = useState('general');
  const [questionCount, setQuestionCount] = useState('10');
  
  const categoryOptions = [
    { value: 'general', label: 'GENERAL' },
    { value: 'health', label: 'HEALTH MYTHS' },
    { value: 'social-media', label: 'SOCIAL MEDIA' },
    { value: 'politics', label: 'POLITICS' },
    { value: 'finance', label: 'FINANCIAL SCAMS' }
  ];
  
  const questionOptions = [
    { value: '10', label: '10 QUESTIONS' },
    { value: '20', label: '20 QUESTIONS' },
    { value: '30', label: '30 QUESTIONS' }
  ];
  
  const handleStartSolo = () => {
    // For now, redirect to a placeholder solo game page
    router.push(`/solo?category=${category}&count=${questionCount}`);
  };
  
  return (
    <Card className="flex flex-col items-center text-center">
      <div className="bg-purple-400 p-4 rounded-full mb-4 inline-block border-2 border-black">
        <span className="material-icons text-white text-5xl">person</span>
      </div>
      <h3 className="font-anton text-3xl mb-4">PLAY SOLO</h3>
      <div className="w-full space-y-4">
        <Select
          options={categoryOptions}
          value={category}
          onChange={setCategory}
        />
        <Select
          options={questionOptions}
          value={questionCount}
          onChange={setQuestionCount}
        />
        <Button 
          variant="blue" 
          onClick={handleStartSolo}
          className="w-full"
        >
          START SOLO BATTLE!
        </Button>
      </div>
    </Card>
  );
};