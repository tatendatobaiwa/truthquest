'use client';

import React from 'react';

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  centered?: boolean;
  className?: string;
  type?: 'text' | 'email' | 'password';
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  centered = false,
  className = '',
  type = 'text',
  maxLength
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      className={`w-full p-3 border-3 border-black rounded bg-gray-100 font-bold placeholder-gray-500 focus:outline-none focus:bg-white transition-colors ${
        centered ? 'text-center' : ''
      } ${className}`}
    />
  );
};