'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

export const Header: React.FC = () => {
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    { href: '/', icon: 'play_arrow', label: 'PLAY' },
    { href: '/host', icon: 'people', label: 'HOST' },
    { href: '/join', icon: 'games', label: 'JOIN GAMES' },
    { href: '/leaderboard', icon: 'leaderboard', label: 'LEADERBOARD' },
    { href: '/stats', icon: 'bar_chart', label: 'STATS' },
    { href: '/profile', icon: 'person', label: 'PROFILE' }
  ];
  
  return (
    <div className="bg-truth-blue">
      <header className="max-w-6xl mx-auto px-8 flex justify-between items-center py-4">
        <div className="flex items-center">
          <div className="bg-red-500 p-3 border-2 border-black mr-4">
            <span className="material-icons text-white text-5xl">shield</span>
          </div>
          <div>
            <h1 className="text-3xl font-anton text-white">TRUTHQUEST</h1>
            <p className="text-sm text-white">FIGHT FAKE NEWS, WIN REAL KNOWLEDGE</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 border-2 border-black font-bold text-black transition-all duration-200 hover:bg-gray-100 ${
                pathname === item.href ? 'bg-truth-yellow' : 'bg-white'
              }`}
            >
              <span className="material-icons mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
    </div>
  );
};