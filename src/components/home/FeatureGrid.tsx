'use client';

import React from 'react';

interface Feature {
  icon: string;
  label: string;
  color: string;
}

export const FeatureGrid: React.FC = () => {
  const features: Feature[] = [
    { icon: 'gps_not_fixed', label: 'SPOT FAKE NEWS', color: 'text-red-500' },
    { icon: 'bolt', label: 'REAL-TIME BATTLES', color: 'text-yellow-500' },
    { icon: 'emoji_events', label: 'LIVE LEADERBOARD', color: 'text-yellow-400' },
    { icon: 'search', label: 'FACT-CHECK SOURCES', color: 'text-blue-500' }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="bg-white border-2 border-black rounded-md p-4 flex flex-col items-center justify-center text-center hover:shadow-truth-sm transition-shadow"
        >
          <span className={`material-icons text-4xl mb-2 ${feature.color}`}>
            {feature.icon}
          </span>
          <span className="font-bold text-sm">{feature.label}</span>
        </div>
      ))}
    </div>
  );
};