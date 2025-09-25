export interface User {
  userId: string;
  farcasterId?: string;
  username: string;
  profilePictureUrl?: string;
  walletAddress?: string;
}

export interface Remix {
  remixId: string;
  userId: string;
  title: string;
  description: string;
  audioFileUrl: string;
  coverImageUrl?: string;
  tags: string[];
  createdAt: Date;
  likes: number;
  comments: Comment[];
  user?: User;
}

export interface Comment {
  commentId: string;
  remixId: string;
  userId: string;
  text: string;
  createdAt: Date;
  user?: User;
}

export interface Asset {
  assetId: string;
  name: string;
  description: string;
  fileUrl: string;
  category: 'loop' | 'sample' | 'effect' | 'beat';
  tags: string[];
  duration?: number;
  bpm?: number;
}

export interface AudioEffect {
  id: string;
  name: string;
  type: 'reverb' | 'delay' | 'distortion' | 'filter' | 'pitch' | 'tempo';
  params: Record<string, number>;
}

export interface RemixProject {
  projectId: string;
  userId: string;
  title: string;
  tracks: AudioTrack[];
  effects: AudioEffect[];
  bpm: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioTrack {
  trackId: string;
  assetId: string;
  startTime: number;
  duration: number;
  volume: number;
  effects: string[];
  muted: boolean;
}
