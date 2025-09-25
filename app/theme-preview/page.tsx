'use client';

import { useTheme } from '../components/ThemeProvider';
import { Music, Play, Heart, MessageCircle, Share2, Settings2 } from 'lucide-react';

export default function ThemePreviewPage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'default', name: 'RemixPlay (Default)', description: 'Music-focused with vibrant gradients' },
    { id: 'celo', name: 'CELO', description: 'Black background, yellow accents' },
    { id: 'solana', name: 'Solana', description: 'Dark purple with magenta accents' },
    { id: 'base', name: 'Base', description: 'Dark blue with Base blue accents' },
    { id: 'coinbase', name: 'Coinbase', description: 'Dark navy with Coinbase blue' },
  ];

  return (
    <div className="min-h-screen p-4 space-y-8">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Theme Preview</h1>
        <p className="text-text-secondary">
          Preview RemixPlay in different blockchain themes
        </p>
      </div>

      {/* Theme Selector */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Select Theme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as any)}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                theme === themeOption.id
                  ? 'bg-accent text-white'
                  : 'bg-surface hover:bg-opacity-80 text-text-primary'
              }`}
            >
              <h3 className="font-medium mb-1">{themeOption.name}</h3>
              <p className={`text-sm ${
                theme === themeOption.id ? 'text-white/80' : 'text-text-secondary'
              }`}>
                {themeOption.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Component Previews */}
      <div className="space-y-6">
        {/* Buttons */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="tool-button">
              <Settings2 className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="remix-card">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="waveform">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="waveform-bar"
                      style={{
                        width: '3px',
                        height: `${Math.random() * 30 + 10}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Sample Remix</h3>
              <p className="text-text-secondary text-sm mb-3">
                A beautiful remix showcasing the current theme
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-1 text-text-secondary hover:text-red-400">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">24</span>
                  </button>
                  <button className="flex items-center space-x-1 text-text-secondary hover:text-blue-400">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">8</span>
                  </button>
                </div>
                <button className="text-text-secondary hover:text-accent">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">Audio Asset</h3>
                  <p className="text-sm text-text-secondary">Electronic Beat</p>
                </div>
              </div>
              <button className="w-full btn-primary flex items-center justify-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Play Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Audio Visualizer */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Audio Visualizer</h2>
          <div className="audio-visualizer h-32 flex items-center justify-center">
            <div className="waveform scale-150">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="waveform-bar animate-pulse"
                  style={{
                    width: '3px',
                    height: `${Math.random() * 60 + 20}px`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 bg-bg rounded-lg border border-white/10"></div>
              <p className="text-sm text-text-secondary">Background</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-surface rounded-lg"></div>
              <p className="text-sm text-text-secondary">Surface</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-accent rounded-lg"></div>
              <p className="text-sm text-text-secondary">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-text-primary rounded-lg"></div>
              <p className="text-sm text-text-secondary">Text Primary</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
