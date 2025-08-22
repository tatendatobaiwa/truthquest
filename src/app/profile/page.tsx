'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ProfilePage() {
  const [username, setUsername] = useState('FactFinder22');
  const [bio, setBio] = useState('"Slaying misinformation one fact at a time. Join my quest for truth!"');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  
  const achievements = [
    { name: 'First Victory', description: 'Win your first game.', icon: 'emoji_events', unlocked: true, color: 'text-yellow-500' },
    { name: 'Hot Streak', description: 'Win 5 games in a row.', icon: 'local_fire_department', unlocked: true, color: 'text-yellow-500' },
    { name: 'Fact Checker', description: 'Answer 100 questions correctly.', icon: 'auto_stories', unlocked: true, color: 'text-purple-500' },
    { name: 'Party Starter', description: 'Host your first game.', icon: 'groups', unlocked: true, color: 'text-blue-500' },
    { name: 'Truth Legend', description: 'Reach Level 20.', icon: 'lock', unlocked: false, color: 'text-gray-400' },
    { name: 'Marathon Runner', description: 'Play for 24 hours total.', icon: 'lock', unlocked: false, color: 'text-gray-400' }
  ];
  
  const stats = [
    { label: 'Correct Answers', value: '1,245', icon: 'check_circle', color: 'text-green-500' },
    { label: 'Incorrect Answers', value: '312', icon: 'cancel', color: 'text-red-500' },
    { label: 'Win Rate', value: '80%', icon: 'military_tech', color: 'text-blue-500' },
    { label: 'Games Won', value: '98', icon: 'emoji_events', color: 'text-yellow-500' }
  ];
  
  const avatarOptions = [
    '👤', '🧑‍💻', '🕵️', '🧠', '🎯'
  ];
  
  return (
    <main className="main-container">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-black shadow-lg bg-gray-200 flex items-center justify-center text-6xl">
                {avatarOptions[selectedAvatar]}
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full border-2 border-black">
                <span className="material-icons text-white">edit</span>
              </div>
            </div>
            
            <h2 className="font-anton text-4xl">{username}</h2>
            <p className="text-gray-600 font-bold">@{username.toLowerCase()}</p>
            <p className="mt-4 text-gray-800">{bio}</p>
            
            <div className="mt-6">
              <p className="font-bold">LEVEL 12 - TRUTH SEEKER</p>
              <div className="progress-bar mt-2">
                <div className="progress" style={{ width: '60%' }}>60%</div>
              </div>
              <p className="text-sm text-gray-500 mt-1">4000/10000 XP to next level</p>
            </div>
          </Card>
          
          <Card>
            <h3 className="font-anton text-2xl mb-4">STATS</h3>
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center font-bold">
                  <span className="flex items-center">
                    <span className={`material-icons mr-2 ${stat.color}`}>{stat.icon}</span>
                    {stat.label}
                  </span>
                  <span>{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Achievements */}
          <Card>
            <h3 className="font-anton text-3xl mb-4">ACHIEVEMENTS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`achievement ${!achievement.unlocked ? 'locked' : ''}`}>
                  <span className={`material-icons text-4xl ${achievement.color}`}>
                    {achievement.icon}
                  </span>
                  <div>
                    <h4 className="font-bold">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Customize Profile */}
          <Card>
            <h3 className="font-anton text-3xl mb-4">CUSTOMIZE PROFILE</h3>
            <div className="space-y-6">
              <div>
                <label className="font-bold text-lg mb-2 block">Username</label>
                <Input
                  placeholder="Enter username"
                  value={username}
                  onChange={setUsername}
                />
              </div>
              
              <div>
                <label className="font-bold text-lg mb-2 block">Bio</label>
                <textarea
                  className="w-full p-3 border-3 border-black rounded bg-gray-100 font-bold placeholder-gray-500 focus:outline-none focus:bg-white transition-colors"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-2">Avatar</h4>
                <div className="flex flex-wrap gap-4">
                  {avatarOptions.map((avatar, index) => (
                    <div
                      key={index}
                      className={`avatar-option ${selectedAvatar === index ? 'selected' : ''}`}
                      onClick={() => setSelectedAvatar(index)}
                    >
                      <div className="w-16 h-16 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-300 transition-colors">
                        {avatar}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="blue">SAVE CHANGES</Button>
                <Button variant="gray">CANCEL</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}