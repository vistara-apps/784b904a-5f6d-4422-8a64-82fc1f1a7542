'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Square, Save, Upload, Settings2, Volume2, Zap } from 'lucide-react';
import { Asset, AudioEffect, RemixProject } from '@/lib/types';
import { AUDIO_EFFECTS, BPM_RANGE } from '@/lib/constants';
import { AssetPicker } from './AssetPicker';
import { PaymentDemo } from './PaymentDemo';
import { clamp } from '@/lib/utils';

interface RemixStudioProps {
  onSave?: (project: RemixProject) => void;
  className?: string;
}

export function RemixStudio({ onSave, className = '' }: RemixStudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [activeEffects, setActiveEffects] = useState<AudioEffect[]>([]);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.8);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control the Web Audio API
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop recording
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAssets(prev => 
      prev.includes(asset.assetId) 
        ? prev.filter(id => id !== asset.assetId)
        : [...prev, asset.assetId]
    );
  };

  const handleEffectToggle = (effect: AudioEffect) => {
    setActiveEffects(prev => {
      const exists = prev.find(e => e.id === effect.id);
      if (exists) {
        return prev.filter(e => e.id !== effect.id);
      } else {
        return [...prev, { ...effect }];
      }
    });
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would process the uploaded file
      console.log('File uploaded:', file.name);
    }
  };

  const handleSave = () => {
    const project: RemixProject = {
      projectId: `project-${Date.now()}`,
      userId: 'current-user',
      title: 'My Remix',
      tracks: [],
      effects: activeEffects,
      bpm,
      duration: 60,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onSave?.(project);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Remix Studio</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlay}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-0.5" />
              )}
            </button>
            
            <button
              onClick={handleStop}
              className="w-10 h-10 bg-surface rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all duration-200"
            >
              <Square className="w-5 h-5 text-text-secondary" />
            </button>
            
            <button
              onClick={handleRecord}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-surface hover:bg-opacity-80'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                isRecording ? 'bg-white animate-pulse' : 'bg-red-500'
              }`} />
            </button>
          </div>

          {/* BPM and Volume */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">BPM</span>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(clamp(parseInt(e.target.value) || 120, BPM_RANGE.min, BPM_RANGE.max))}
                className="w-16 px-2 py-1 bg-surface border border-white/10 rounded text-text-primary text-sm"
                min={BPM_RANGE.min}
                max={BPM_RANGE.max}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-text-secondary" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Waveform Display */}
      <div className="glass-card p-4">
        <div className="audio-visualizer h-32 flex items-center justify-center">
          <div className="waveform scale-150">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className={`waveform-bar ${isPlaying ? 'animate-pulse' : ''}`}
                style={{
                  width: '3px',
                  height: `${Math.random() * 60 + 20}px`,
                  animationDelay: `${i * 0.03}s`,
                  opacity: isPlaying ? 1 : 0.5,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Timeline */}
        <div className="mt-4">
          <div className="h-1 bg-white/20 rounded-full relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / 60) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>0:00</span>
            <span>1:00</span>
          </div>
        </div>
      </div>

      {/* Payment Demo */}
      <PaymentDemo />

      {/* Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Assets */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-text-primary">Assets</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleFileUpload}
                className="tool-button"
                title="Upload Audio"
              >
                <Upload className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={() => setShowAssetPicker(!showAssetPicker)}
                className="tool-button"
                title="Browse Library"
              >
                <Settings2 className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {selectedAssets.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-4">
                No assets selected. Browse the library or upload your own.
              </p>
            ) : (
              selectedAssets.map((assetId) => (
                <div key={assetId} className="flex items-center justify-between p-2 bg-surface/50 rounded">
                  <span className="text-sm text-text-primary">Asset {assetId}</span>
                  <button
                    onClick={() => setSelectedAssets(prev => prev.filter(id => id !== assetId))}
                    className="text-xs text-text-secondary hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Effects */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-text-primary">Effects</h3>
            <button
              onClick={() => setShowEffects(!showEffects)}
              className="tool-button"
              title="Effect Settings"
            >
              <Zap className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {AUDIO_EFFECTS.slice(0, 4).map((effect) => (
              <button
                key={effect.id}
                onClick={() => handleEffectToggle(effect)}
                className={`p-2 rounded text-xs font-medium transition-colors ${
                  activeEffects.find(e => e.id === effect.id)
                    ? 'bg-accent text-white'
                    : 'bg-surface text-text-secondary hover:bg-accent/20'
                }`}
              >
                {effect.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mix */}
        <div className="glass-card p-4">
          <h3 className="font-medium text-text-primary mb-3">Mix</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary">Master Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer mt-1"
              />
            </div>
            
            <div>
              <label className="text-xs text-text-secondary">Tempo</label>
              <input
                type="range"
                min={BPM_RANGE.min}
                max={BPM_RANGE.max}
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer mt-1"
              />
              <div className="text-xs text-text-secondary text-center mt-1">{bpm} BPM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Picker Modal */}
      {showAssetPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Asset Library</h3>
              <button
                onClick={() => setShowAssetPicker(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            <AssetPicker
              variant="grid"
              onSelect={handleAssetSelect}
              selectedAssets={selectedAssets}
            />
          </div>
        </div>
      )}
    </div>
  );
}
