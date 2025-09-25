export const AUDIO_FORMATS = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/webm',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SAMPLE_ASSETS = [
  {
    assetId: 'beat-1',
    name: 'Hip Hop Beat',
    description: 'Classic hip hop drum pattern',
    fileUrl: '/assets/beat-1.mp3',
    category: 'beat' as const,
    tags: ['hip-hop', 'drums', 'urban'],
    duration: 30,
    bpm: 90,
  },
  {
    assetId: 'loop-1',
    name: 'Synth Loop',
    description: 'Atmospheric synth loop',
    fileUrl: '/assets/loop-1.mp3',
    category: 'loop' as const,
    tags: ['synth', 'atmospheric', 'electronic'],
    duration: 8,
    bpm: 120,
  },
  {
    assetId: 'sample-1',
    name: 'Vocal Chop',
    description: 'Processed vocal sample',
    fileUrl: '/assets/sample-1.mp3',
    category: 'sample' as const,
    tags: ['vocal', 'processed', 'melodic'],
    duration: 4,
    bpm: 100,
  },
  {
    assetId: 'beat-2',
    name: 'Electronic Beat',
    description: 'Modern electronic drum pattern',
    fileUrl: '/assets/beat-2.mp3',
    category: 'beat' as const,
    tags: ['electronic', 'modern', 'dance'],
    duration: 32,
    bpm: 128,
  },
];

export const AUDIO_EFFECTS = [
  {
    id: 'reverb',
    name: 'Reverb',
    type: 'reverb' as const,
    params: { roomSize: 0.5, damping: 0.5, wetness: 0.3 },
  },
  {
    id: 'delay',
    name: 'Delay',
    type: 'delay' as const,
    params: { time: 0.25, feedback: 0.3, wetness: 0.2 },
  },
  {
    id: 'distortion',
    name: 'Distortion',
    type: 'distortion' as const,
    params: { amount: 0.5, tone: 0.5 },
  },
  {
    id: 'filter',
    name: 'Filter',
    type: 'filter' as const,
    params: { frequency: 1000, resonance: 1, type: 0 }, // 0=lowpass, 1=highpass, 2=bandpass
  },
  {
    id: 'pitch',
    name: 'Pitch Shift',
    type: 'pitch' as const,
    params: { shift: 0 }, // semitones
  },
  {
    id: 'tempo',
    name: 'Tempo',
    type: 'tempo' as const,
    params: { rate: 1.0 }, // playback rate
  },
];

export const BPM_RANGE = { min: 60, max: 200 };
export const VOLUME_RANGE = { min: 0, max: 1 };
export const PITCH_RANGE = { min: -12, max: 12 };
export const TEMPO_RANGE = { min: 0.5, max: 2.0 };
