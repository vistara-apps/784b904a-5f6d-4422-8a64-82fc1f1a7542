'use client';

import { useState } from 'react';
import { Play, Pause, Download, Plus } from 'lucide-react';
import { Asset } from '@/lib/types';
import { SAMPLE_ASSETS } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';

interface AssetPickerProps {
  variant?: 'grid' | 'list';
  onSelect?: (asset: Asset) => void;
  selectedAssets?: string[];
  className?: string;
}

export function AssetPicker({
  variant = 'grid',
  onSelect,
  selectedAssets = [],
  className = '',
}: AssetPickerProps) {
  const [playingAsset, setPlayingAsset] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'beat', 'loop', 'sample', 'effect'];
  
  const filteredAssets = SAMPLE_ASSETS.filter(asset => 
    selectedCategory === 'all' || asset.category === selectedCategory
  );

  const handlePlay = (assetId: string) => {
    if (playingAsset === assetId) {
      setPlayingAsset(null);
    } else {
      setPlayingAsset(assetId);
      // In a real app, you would play the audio here
      setTimeout(() => setPlayingAsset(null), 3000); // Auto-stop after 3s for demo
    }
  };

  const handleSelect = (asset: Asset) => {
    onSelect?.(asset);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      beat: 'bg-red-500/20 text-red-400',
      loop: 'bg-blue-500/20 text-blue-400',
      sample: 'bg-green-500/20 text-green-400',
      effect: 'bg-purple-500/20 text-purple-400',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-secondary hover:bg-accent/20'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Asset List */}
        <div className="space-y-2">
          {filteredAssets.map((asset) => (
            <div
              key={asset.assetId}
              className={`glass-card p-3 flex items-center space-x-3 hover:bg-opacity-80 transition-all duration-200 ${
                selectedAssets.includes(asset.assetId) ? 'ring-2 ring-accent' : ''
              }`}
            >
              <button
                onClick={() => handlePlay(asset.assetId)}
                className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                {playingAsset === asset.assetId ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-text-primary truncate">{asset.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(asset.category)}`}>
                    {asset.category}
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate">{asset.description}</p>
                <div className="flex items-center space-x-3 text-xs text-text-secondary mt-1">
                  {asset.duration && <span>{formatDuration(asset.duration)}</span>}
                  {asset.bpm && <span>{asset.bpm} BPM</span>}
                </div>
              </div>

              <button
                onClick={() => handleSelect(asset)}
                className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-accent text-white'
                : 'bg-surface text-text-secondary hover:bg-accent/20'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Asset Grid */}
      <div className="asset-grid">
        {filteredAssets.map((asset) => (
          <div
            key={asset.assetId}
            className={`glass-card p-4 hover:bg-opacity-80 transition-all duration-200 cursor-pointer ${
              selectedAssets.includes(asset.assetId) ? 'ring-2 ring-accent' : ''
            }`}
            onClick={() => handleSelect(asset)}
          >
            {/* Asset Preview */}
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="waveform scale-75">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="waveform-bar"
                      style={{
                        width: '2px',
                        height: `${Math.random() * 20 + 5}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(asset.assetId);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200"
              >
                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                  {playingAsset === asset.assetId ? (
                    <Pause className="w-4 h-4 text-gray-900" />
                  ) : (
                    <Play className="w-4 h-4 text-gray-900 ml-0.5" />
                  )}
                </div>
              </button>
            </div>

            {/* Asset Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-text-primary text-sm truncate">{asset.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(asset.category)}`}>
                  {asset.category}
                </span>
              </div>
              
              <p className="text-xs text-text-secondary line-clamp-2">{asset.description}</p>
              
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center space-x-2">
                  {asset.duration && <span>{formatDuration(asset.duration)}</span>}
                  {asset.bpm && <span>{asset.bpm} BPM</span>}
                </div>
                
                {selectedAssets.includes(asset.assetId) && (
                  <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <Plus className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
