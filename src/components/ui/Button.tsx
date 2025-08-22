'use client';

import React from 'react';

interface ButtonProps {
  variant: 'yellow' | 'green' | 'orange' | 'blue' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  icon,
  disabled,
  children,
  onClick,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold cursor-pointer transition-all duration-200 border-3 border-black rounded text-black';
  
  const variantClasses = {
    yellow: 'bg-truth-yellow hover:bg-yellow-400',
    green: 'bg-truth-green hover:bg-green-400',
    orange: 'bg-truth-orange hover:bg-orange-500',
    blue: 'bg-truth-blue hover:bg-blue-400',
    red: 'bg-truth-red hover:bg-red-500 text-white',
    gray: 'bg-gray-300 hover:bg-gray-400'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="material-icons mr-2">{icon}</span>}
      {children}
    </button>
  );
};