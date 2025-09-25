'use client';

import { useState, useEffect } from 'react';
import { Music, Zap, Users, Play, Headphones, Mic } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount } from 'wagmi';
import { SocialFeed } from './components/SocialFeed';
import { RemixStudio } from './components/RemixStudio';
import { UserProfile } from './components/UserProfile';
import { AudioPlayer } from './components/AudioPlayer';
import { User, RemixProject } from '@/lib/types';

export default function HomePage() {
  const [activeView, setActiveView] = useState<'feed' | 'studio' | 'profile'>('feed');
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const { context, setFrameReady } = useMiniKit();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const displayName = context?.user?.displayName ?? 'Creator';

  const mockUser: User = {
    userId: 'current-user',
    username: displayName,
    profilePictureUrl: context?.user?.pfpUrl,
    walletAddress: address,
  };

  const handleProjectSave = (project: RemixProject) => {
    console.log('Project saved:', project);
    // In a real app, this would save to IPFS/database
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gradient">RemixPlay</h1>
          </div>

          {/* Tagline */}
          <p className="text-lg text-text-secondary">
            Remix Audio, Share Vibes, Play with Sound
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 text-left">
            <div className="glass-card p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Intuitive Remixing</h3>
                <p className="text-sm text-text-secondary">Drag, drop, and create amazing remixes</p>
              </div>
            </div>
            
            <div className="glass-card p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Audio Library</h3>
                <p className="text-sm text-text-secondary">Access curated sounds and samples</p>
              </div>
            </div>
            
            <div className="glass-card p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Social Community</h3>
                <p className="text-sm text-text-secondary">Share and discover amazing remixes</p>
              </div>
            </div>
          </div>

          {/* Connect Wallet */}
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Connect your wallet to start remixing
            </p>
            <Wallet>
              <ConnectWallet>
                <div className="btn-primary w-full flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Connect & Start Creating</span>
                </div>
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card m-4 p-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">RemixPlay</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-surface rounded-lg p-1">
            <button
              onClick={() => setActiveView('feed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'feed'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveView('studio')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'studio'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setActiveView('profile')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'profile'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Profile
            </button>
          </nav>

          {/* User */}
          <Wallet>
            <ConnectWallet>
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8" />
                <Name className="text-text-primary font-medium" />
              </div>
            </ConnectWallet>
          </Wallet>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {activeView === 'feed' && <SocialFeed />}
        {activeView === 'studio' && <RemixStudio onSave={handleProjectSave} />}
        {activeView === 'profile' && <UserProfile user={mockUser} isOwnProfile={true} />}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card m-4 rounded-xl">
        <div className="flex items-center justify-around p-4">
          <button
            onClick={() => setActiveView('feed')}
            className={`flex flex-col items-center space-y-1 ${
              activeView === 'feed' ? 'text-accent' : 'text-text-secondary'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Feed</span>
          </button>
          
          <button
            onClick={() => setActiveView('studio')}
            className={`flex flex-col items-center space-y-1 ${
              activeView === 'studio' ? 'text-accent' : 'text-text-secondary'
            }`}
          >
            <Play className="w-5 h-5" />
            <span className="text-xs">Studio</span>
          </button>
          
          <button
            onClick={() => setActiveView('profile')}
            className={`flex flex-col items-center space-y-1 ${
              activeView === 'profile' ? 'text-accent' : 'text-text-secondary'
            }`}
          >
            <Music className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Audio Player (Global) */}
      {currentAudio && (
        <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-40">
          <AudioPlayer
            src={currentAudio}
            title="Current Track"
            artist="Artist Name"
            onEnded={() => setCurrentAudio(null)}
          />
        </div>
      )}
    </div>
  );
}
