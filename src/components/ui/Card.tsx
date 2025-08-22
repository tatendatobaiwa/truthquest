'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'stat';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const baseClasses = 'bg-white border-3 border-black rounded-lg';
  
  const variantClasses = {
    default: 'p-8 shadow-truth',
    stat: 'p-6 shadow-truth-sm text-center'
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};