import React from 'react';
import { MusicGenre } from '../types';

interface GenreSelectorProps {
    selectedGenre: MusicGenre;
    onGenreChange: (genre: MusicGenre) => void;
}

const genres: { id: MusicGenre, label: string }[] = [
    { id: 'cinematic', label: 'Cinematic' },
    { id: 'electronic', label: 'Electronic' },
    { id: 'calm', label: 'Calm' },
    { id: 'energetic', label: 'Energetic' },
];

const GenreSelector: React.FC<GenreSelectorProps> = ({ selectedGenre, onGenreChange }) => {
    return (
        <div className="flex flex-col items-center mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-300">Select a Music Genre Vibe</h3>
            <div className="flex justify-center flex-wrap gap-2 bg-gray-700/50 p-2 rounded-lg">
                {genres.map(genre => (
                    <button
                        key={genre.id}
                        onClick={() => onGenreChange(genre.id)}
                        className={`
                            px-4 py-2 rounded-md text-sm font-medium transition-colors
                            ${selectedGenre === genre.id
                                ? 'bg-cyan-500 text-white shadow'
                                : 'text-gray-300 bg-gray-600/50 hover:bg-gray-600'
                            }
                        `}
                    >
                        {genre.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GenreSelector;
