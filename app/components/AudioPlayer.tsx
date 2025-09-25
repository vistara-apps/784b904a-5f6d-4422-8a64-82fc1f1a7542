'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface AudioPlayerProps {
  src?: string;
  title?: string;
  artist?: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  autoPlay?: boolean;
  className?: string;
}

export function AudioPlayer({
  src,
  title = 'Untitled',
  artist = 'Unknown Artist',
  onEnded,
  onTimeUpdate,
  autoPlay = false,
  className = '',
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime, audio.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, autoPlay, onTimeUpdate, onEnded]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`glass-card p-4 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Track Info */}
      <div className="mb-4">
        <h3 className="font-medium text-text-primary truncate">{title}</h3>
        <p className="text-sm text-text-secondary truncate">{artist}</p>
      </div>

      {/* Waveform Visualization */}
      <div className="audio-visualizer mb-4 h-16 flex items-center justify-center">
        <div className="waveform">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={`waveform-bar ${isPlaying ? 'animate-pulse' : ''}`}
              style={{
                width: '2px',
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${i * 0.05}s`,
                opacity: i / 40 < progress / 100 ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="h-2 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
          )}
        </div>
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => skip(-10)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            disabled={!src}
          >
            <SkipBack className="w-4 h-4 text-text-secondary" />
          </button>
          
          <button
            onClick={togglePlay}
            disabled={!src || isLoading}
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
          
          <button
            onClick={() => skip(10)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            disabled={!src}
          >
            <SkipForward className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-text-secondary" />
            ) : (
              <Volume2 className="w-4 h-4 text-text-secondary" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  );
}
