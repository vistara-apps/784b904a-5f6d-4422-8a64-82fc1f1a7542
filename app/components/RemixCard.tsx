'use client';

import { useState } from 'react';
import { Play, Pause, Heart, MessageCircle, Share2, User } from 'lucide-react';
import { Remix } from '@/lib/types';
import { formatTimeAgo, formatDuration } from '@/lib/utils';

interface RemixCardProps {
  remix: Remix;
  variant?: 'default' | 'compact';
  onPlay?: (remix: Remix) => void;
  onLike?: (remixId: string) => void;
  onComment?: (remixId: string) => void;
  onShare?: (remix: Remix) => void;
  isPlaying?: boolean;
}

export function RemixCard({
  remix,
  variant = 'default',
  onPlay,
  onLike,
  onComment,
  onShare,
  isPlaying = false,
}: RemixCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(remix.remixId);
  };

  const handlePlay = () => {
    onPlay?.(remix);
  };

  if (variant === 'compact') {
    return (
      <div className="remix-card flex items-center space-x-3">
        <button
          onClick={handlePlay}
          className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text-primary truncate">{remix.title}</h3>
          <p className="text-sm text-text-secondary truncate">
            by {remix.user?.username || 'Unknown'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-text-secondary">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 hover:text-red-400 transition-colors ${
              isLiked ? 'text-red-400' : ''
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{remix.likes}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="remix-card">
      {/* Cover Image */}
      <div className="relative mb-4">
        <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg overflow-hidden">
          {remix.coverImageUrl ? (
            <img
              src={remix.coverImageUrl}
              alt={remix.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="waveform">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="waveform-bar"
                    style={{
                      width: '3px',
                      height: `${Math.random() * 40 + 10}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Play Button Overlay */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200"
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-gray-900" />
            ) : (
              <Play className="w-8 h-8 text-gray-900 ml-1" />
            )}
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-text-primary text-lg leading-tight">
            {remix.title}
          </h3>
          <p className="text-text-secondary text-sm mt-1 line-clamp-2">
            {remix.description}
          </p>
        </div>

        {/* Tags */}
        {remix.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {remix.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* User Info */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            {remix.user?.profilePictureUrl ? (
              <img
                src={remix.user.profilePictureUrl}
                alt={remix.user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-3 h-3 text-white" />
            )}
          </div>
          <span className="text-sm text-text-secondary">
            {remix.user?.username || 'Unknown'}
          </span>
          <span className="text-xs text-text-secondary">
            • {formatTimeAgo(remix.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 hover:text-red-400 transition-colors ${
                isLiked ? 'text-red-400' : 'text-text-secondary'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{remix.likes}</span>
            </button>
            
            <button
              onClick={() => onComment?.(remix.remixId)}
              className="flex items-center space-x-1 text-text-secondary hover:text-blue-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{remix.comments.length}</span>
            </button>
          </div>
          
          <button
            onClick={() => onShare?.(remix)}
            className="text-text-secondary hover:text-accent transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
