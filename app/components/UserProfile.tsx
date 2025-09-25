'use client';

import { useState } from 'react';
import { User, Settings2, Share2, Music, Heart, MessageCircle } from 'lucide-react';
import { User as UserType, Remix } from '@/lib/types';
import { RemixCard } from './RemixCard';

interface UserProfileProps {
  user: UserType;
  remixes?: Remix[];
  isOwnProfile?: boolean;
  className?: string;
}

export function UserProfile({ 
  user, 
  remixes = [], 
  isOwnProfile = false, 
  className = '' 
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'remixes' | 'liked' | 'following'>('remixes');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const stats = {
    remixes: remixes.length,
    likes: remixes.reduce((total, remix) => total + remix.likes, 0),
    followers: 156, // Mock data
    following: 89,   // Mock data
  };

  const handlePlay = (remix: Remix) => {
    if (currentlyPlaying === remix.remixId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(remix.remixId);
    }
  };

  const handleLike = (remixId: string) => {
    console.log('Like remix:', remixId);
  };

  const handleComment = (remixId: string) => {
    console.log('Comment on remix:', remixId);
  };

  const handleShare = (remix: Remix) => {
    console.log('Share remix:', remix.title);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <div className="glass-card p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-text-primary truncate">
                {user.username}
              </h1>
              <div className="flex items-center space-x-2">
                {isOwnProfile ? (
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Settings2 className="w-5 h-5 text-text-secondary" />
                  </button>
                ) : (
                  <>
                    <button className="btn-primary">Follow</button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-text-secondary" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Wallet Address */}
            {user.walletAddress && (
              <p className="text-sm text-text-secondary mb-3 font-mono">
                {user.walletAddress}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-text-primary">{stats.remixes}</div>
                <div className="text-xs text-text-secondary">Remixes</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-text-primary">{stats.likes}</div>
                <div className="text-xs text-text-secondary">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-text-primary">{stats.followers}</div>
                <div className="text-xs text-text-secondary">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-text-primary">{stats.following}</div>
                <div className="text-xs text-text-secondary">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface rounded-lg p-1">
        <button
          onClick={() => setActiveTab('remixes')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'remixes'
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Remixes</span>
        </button>
        
        <button
          onClick={() => setActiveTab('liked')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'liked'
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Liked</span>
        </button>
        
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'following'
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Following</span>
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'remixes' && (
          <div>
            {remixes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remixes.map((remix) => (
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
            ) : (
              <div className="text-center py-12">
                <Music className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  No remixes yet
                </h3>
                <p className="text-text-secondary">
                  {isOwnProfile 
                    ? "Start creating your first remix!" 
                    : "This user hasn't created any remixes yet."
                  }
                </p>
                {isOwnProfile && (
                  <button className="btn-primary mt-4">
                    Create Remix
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No liked remixes
            </h3>
            <p className="text-text-secondary">
              Liked remixes will appear here.
            </p>
          </div>
        )}

        {activeTab === 'following' && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Following list
            </h3>
            <p className="text-text-secondary">
              Users you follow will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
