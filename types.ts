export type InputMode = 'image' | 'text' | 'audio';

export interface CreativePrompts {
  artPrompt: string;
}

export interface User {
  email: string;
  username: string;
  isGoogleUser?: boolean;
}

export interface MusicTrack {
  title: string;
  artist: string;
  url: string;
  genre: MusicGenre;
}

export type MusicGenre = 'cinematic' | 'electronic' | 'calm' | 'energetic';