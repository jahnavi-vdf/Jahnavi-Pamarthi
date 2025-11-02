import { MusicTrack, MusicGenre } from '../types';

type MusicDatabase = {
    [key: string]: MusicTrack[];
};

const musicDatabase: MusicDatabase = {
  "happy": [
    {
      "title": "Shine On", "artist": "AI Composer",
      "url": "https://storage.googleapis.com/heart-sync-ai-music/happy/happy1.mp3",
      "genre": "energetic"
    },
    {
      "title": "Vibe High", "artist": "AI Composer",
      "url": "https://storage.googleapis.com/heart-sync-ai-music/happy/happy2.mp3",
      "genre": "electronic"
    }
  ],
  "joyful": [
    {
      "title": "Shine On", "artist": "AI Composer",
      "url": "https://storage.googleapis.com/heart-sync-ai-music/happy/happy1.mp3",
      "genre": "energetic"
    }
  ],
  "sad": [
    {
      "title": "Blue Skies", "artist": "AI Composer",
      "url": "https://storage.googleapis.com/heart-sync-ai-music/sad/sad1.mp3",
      "genre": "calm"
    }
  ],
  "calm": [
    {
      "title": "Peace Flow", "artist": "AI Composer",
      "url": "https://storage.googleapis.com/heart-sync-ai-music/calm/calm1.mp3",
      "genre": "calm"
    }
  ],
  "contemplative": [
     {
      "title": "Peace Flow", "artist": "AI Composer",
      "url": "https://storage.googleapis.com/heart-sync-ai-music/calm/calm1.mp3",
      "genre": "cinematic"
    }
  ],
  "energetic": [
    {
      "title": "Rise Up", "artist": "AI Composer",
      "url": "https://storage.googleapis.com/heart-sync-ai-music/energetic/energy1.mp3",
      "genre": "energetic"
    }
  ]
};

const allTracks = Object.values(musicDatabase).flat();

export const getMusicForEmotionAndGenre = (emotion: string, genre: MusicGenre): MusicTrack | null => {
    if (allTracks.length === 0) return null;

    const normalizedEmotion = emotion.toLowerCase().replace(/[^a-z]/g, '');
    
    // 1. Perfect match: emotion + genre
    const emotionTracks = musicDatabase[normalizedEmotion] || [];
    const perfectMatchTracks = emotionTracks.filter(track => track.genre === genre);
    if (perfectMatchTracks.length > 0) {
        return perfectMatchTracks[Math.floor(Math.random() * perfectMatchTracks.length)];
    }
    
    // 2. Fallback: just emotion
    if (emotionTracks.length > 0) {
        return emotionTracks[Math.floor(Math.random() * emotionTracks.length)];
    }
    
    // 3. Fallback: just genre
    const genreMatchTracks = allTracks.filter(track => track.genre === genre);
    if (genreMatchTracks.length > 0) {
        return genreMatchTracks[Math.floor(Math.random() * genreMatchTracks.length)];
    }

    // 4. Final fallback: any random track
    return allTracks[Math.floor(Math.random() * allTracks.length)];
};