import React, { useRef, useState } from 'react';
import { CreativePrompts, MusicTrack } from '../types';
import SocialShare from './SocialShare';
import { SaveIcon, PlayIcon, PauseIcon } from './icons';

interface ResultsDisplayProps {
    emotion: string;
    transcription?: string;
    prompts: CreativePrompts | null;
    generatedImage: string;
    musicTrack: MusicTrack | null;
    onSaveImage: () => void;
    isLoggedIn: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
    emotion,
    transcription,
    prompts,
    generatedImage,
    musicTrack,
    onSaveImage,
    isLoggedIn,
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    return (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg p-6 mt-8 animate-fade-in">
            <h2 className="text-center text-3xl font-bold mb-6">
                Your Emotion: <span className="text-purple-400">{emotion}</span>
            </h2>

            {transcription && (
                 <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-300">Your Transcription:</h4>
                    <p className="text-gray-400 italic">"{transcription}"</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left side: Image and actions */}
                <div className="flex flex-col items-center">
                    {generatedImage ? (
                        <img src={generatedImage} alt={prompts?.artPrompt || 'Generated art'} className="w-full rounded-lg shadow-2xl" />
                    ) : (
                        <div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                            <p>Generating image...</p>
                        </div>
                    )}
                    <div className="flex items-center space-x-4 mt-4 w-full">
                       <button
                          onClick={onSaveImage}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:bg-gray-500"
                       >
                         <SaveIcon className="w-5 h-5 mr-2" />
                         {isLoggedIn ? 'Save to Gallery' : 'Login to Save'}
                       </button>
                       <SocialShare imageUrl={generatedImage} prompt={prompts?.artPrompt} />
                    </div>
                </div>

                {/* Right side: Prompts and Music */}
                <div>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-pink-400">AI Art Prompt</h3>
                        <p className="bg-gray-900 p-4 rounded-lg text-gray-300 font-mono text-sm">
                            {prompts?.artPrompt || 'Generating prompt...'}
                        </p>
                    </div>
                    
                    <div>
                         <h3 className="text-xl font-semibold mb-2 text-cyan-400">Suggested Music</h3>
                         {musicTrack ? (
                             <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
                                 <div>
                                     <p className="font-bold">{musicTrack.title}</p>
                                     <p className="text-sm text-gray-400">{musicTrack.artist}</p>
                                 </div>
                                 <button onClick={togglePlayPause} className="p-2 bg-purple-600 rounded-full hover:bg-purple-700">
                                     {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                                 </button>
                                 <audio 
                                    ref={audioRef} 
                                    src={musicTrack.url} 
                                    onEnded={() => setIsPlaying(false)}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    loop 
                                />
                             </div>
                         ) : (
                             <p className="text-gray-400">Finding a matching track...</p>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;
