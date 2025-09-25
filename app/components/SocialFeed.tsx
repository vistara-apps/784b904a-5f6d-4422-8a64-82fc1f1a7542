'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Clock, Heart } from 'lucide-react';
import { Remix, User } from '@/lib/types';
import { RemixCard } from './RemixCard';
import { formatTimeAgo } from '@/lib/utils';

interface SocialFeedProps {
  className?: string;
}

// Mock data for demonstration
const MOCK_USERS: User[] = [
  {
    userId: 'user-1',
    username: 'beatmaker_pro',
    profilePictureUrl: undefined,
    walletAddress: '0x1234...5678',
  },
  {
    userId: 'user-2',
    username: 'synth_wizard',
    profilePictureUrl: undefined,
    walletAddress: '0x8765...4321',
  },
  {
    userId: 'user-3',
    username: 'vocal_artist',
    profilePictureUrl: undefined,
    walletAddress: '0xabcd...efgh',
  },
];

const MOCK_REMIXES: Remix[] = [
  {
    remixId: 'remix-1',
    userId: 'user-1',
    title: 'Midnight Vibes',
    description: 'A chill lo-fi remix perfect for late night coding sessions. Mixed with ambient pads and crisp drums.',
    audioFileUrl: '/audio/remix-1.mp3',
    tags: ['lo-fi', 'chill', 'ambient'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 24,
    comments: [],
    user: MOCK_USERS[0],
  },
  {
    remixId: 'remix-2',
    userId: 'user-2',
    title: 'Electric Dreams',
    description: 'High-energy electronic remix with heavy synths and driving beats. Perfect for the dance floor!',
    audioFileUrl: '/audio/remix-2.mp3',
    tags: ['electronic', 'dance', 'synth'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 42,
    comments: [],
    user: MOCK_USERS[1],
  },
  {
    remixId: 'remix-3',
    userId: 'user-3',
    title: 'Vocal Harmony',
    description: 'Beautiful vocal layers with orchestral elements. A cinematic journey through sound.',
    audioFileUrl: '/audio/remix-3.mp3',
    tags: ['vocal', 'orchestral', 'cinematic'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    likes: 18,
    comments: [],
    user: MOCK_USERS[2],
  },
];

export function SocialFeed({ className = '' }: SocialFeedProps) {
  const [remixes, setRemixes] = useState<Remix[]>(MOCK_REMIXES);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'trending' | 'liked'>('recent');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePlay = (remix: Remix) => {
    if (currentlyPlaying === remix.remixId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(remix.remixId);
      // In a real app, you would play the audio here
    }
  };

  const handleLike = (remixId: string) => {
    setRemixes(prev => prev.map(remix => 
      remix.remixId === remixId 
        ? { ...remix, likes: remix.likes + 1 }
        : remix
    ));
  };

  const handleComment = (remixId: string) => {
    // In a real app, this would open a comment modal
    console.log('Comment on remix:', remixId);
  };

  const handleShare = (remix: Remix) => {
    // In a real app, this would share to Farcaster
    console.log('Share remix:', remix.title);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const sortedRemixes = [...remixes].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.likes - a.likes;
      case 'liked':
        return b.likes - a.likes;
      case 'recent':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Community Feed</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-text-secondary ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Sort Options */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSortBy('recent')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            sortBy === 'recent'
              ? 'bg-accent text-white'
              : 'bg-surface text-text-secondary hover:bg-accent/20'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Recent</span>
        </button>
        
        <button
          onClick={() => setSortBy('trending')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            sortBy === 'trending'
              ? 'bg-accent text-white'
              : 'bg-surface text-text-secondary hover:bg-accent/20'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Trending</span>
        </button>
        
        <button
          onClick={() => setSortBy('liked')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            sortBy === 'liked'
              ? 'bg-accent text-white'
              : 'bg-surface text-text-secondary hover:bg-accent/20'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Most Liked</span>
        </button>
      </div>

      {/* Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRemixes.map((remix) => (
          <RemixCard
            key={remix.remixId}
            remix={remix}
            onPlay={handlePlay}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            isPlaying={currentlyPlaying === remix.remixId}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn-secondary">
          Load More Remixes
        </button>
      </div>
    </div>
  );
}
