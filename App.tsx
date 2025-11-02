import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputTabs from './components/InputTabs';
import ImageUploader from './components/ImageUploader';
import TextInput from './components/TextInput';
import AudioRecorder from './components/AudioRecorder';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import Gallery from './components/Gallery';
import GenreSelector from './components/GenreSelector';
import { InputMode, User, CreativePrompts, MusicTrack, MusicGenre } from './types';
import * as geminiService from './services/geminiService';
import * as authService from './services/authService';
import { getMusicForEmotionAndGenre } from './services/musicLibrary';
import { saveImage as saveImageToGallery } from './services/galleryService';

const App: React.FC = () => {
    // State management
    const [user, setUser] = useState<User | null>(null);
    const [inputMode, setInputMode] = useState<InputMode>('text');
    const [emotion, setEmotion] = useState<string>('');
    const [prompts, setPrompts] = useState<CreativePrompts | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string>('');
    const [musicTrack, setMusicTrack] = useState<MusicTrack | null>(null);
    const [transcription, setTranscription] = useState<string>('');
    const [selectedGenre, setSelectedGenre] = useState<MusicGenre>('cinematic');
    
    // UI state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [showSignup, setShowSignup] = useState<boolean>(false);
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
    const [showGallery, setShowGallery] = useState<boolean>(false);

    useEffect(() => {
        setUser(authService.getCurrentUser());
    }, []);

    const resetState = () => {
        setEmotion('');
        setPrompts(null);
        setGeneratedImage('');
        setMusicTrack(null);
        setError('');
        setTranscription('');
    };

    const handleAnalysis = async (data: string | { base64: string, mimeType: string }) => {
        resetState();
        setIsLoading(true);
        try {
            let detectedEmotion = '';
            let audioTranscription = '';

            if (inputMode === 'image' && typeof data === 'object') {
                detectedEmotion = await geminiService.analyzeEmotionFromImage(data.base64, data.mimeType);
            } else if (inputMode === 'text' && typeof data === 'string') {
                detectedEmotion = await geminiService.analyzeEmotionFromText(data);
            } else if (inputMode === 'audio' && typeof data === 'object') {
                const result = await geminiService.transcribeAndAnalyzeEmotionFromAudio(data.base64, data.mimeType);
                detectedEmotion = result.emotion;
                audioTranscription = result.transcription;
            }
            
            if (!detectedEmotion) {
                throw new Error("Could not detect an emotion. Please try again with a different input.");
            }

            setEmotion(detectedEmotion);
            if (audioTranscription) setTranscription(audioTranscription);

            const creativePrompts = await geminiService.generateCreativePrompts(detectedEmotion);
            setPrompts(creativePrompts);

            const imageBase64 = await geminiService.generateImage(creativePrompts.artPrompt);
            setGeneratedImage(`data:image/jpeg;base64,${imageBase64}`);

            const track = getMusicForEmotionAndGenre(detectedEmotion, selectedGenre);
            setMusicTrack(track);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveImage = () => {
        if (user && generatedImage) {
            saveImageToGallery(user.email, generatedImage);
            alert('Image saved to your gallery!');
        } else {
            setShowLogin(true);
        }
    };
    
    const handleLogout = () => {
        authService.logout();
        setUser(null);
    };

    const openLogin = () => { setShowLogin(true); setShowSignup(false); setShowForgotPassword(false); };
    const openSignup = () => { setShowSignup(true); setShowLogin(false); setShowForgotPassword(false); };
    const openForgotPassword = () => { setShowForgotPassword(true); setShowLogin(false); setShowSignup(false); };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Header user={user} onLoginClick={openLogin} onSignupClick={openSignup} onLogout={handleLogout} onGalleryClick={() => setShowGallery(true)} />
            
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">HeartSync AI</h1>
                    <p className="text-lg text-gray-300 mb-8">Turn Your Emotions into Art and Music</p>
                </div>

                <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
                    <InputTabs currentMode={inputMode} onModeChange={(mode) => { setInputMode(mode); resetState(); }} />
                    <div className="mt-6">
                        {inputMode === 'image' && <ImageUploader onAnalyze={handleAnalysis} disabled={isLoading} />}
                        {inputMode === 'text' && <TextInput onAnalyze={handleAnalysis} disabled={isLoading} />}
                        {inputMode === 'audio' && <AudioRecorder onAnalyze={handleAnalysis} disabled={isLoading} />}
                    </div>
                </div>

                {error && <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-900/50 text-red-300 rounded-lg text-center">{error}</div>}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center mt-8">
                        <Loader className="w-12 h-12" />
                        <p className="mt-4 text-gray-400 animate-pulse">Syncing with your heart... this may take a moment.</p>
                    </div>
                )}
                
                {!isLoading && emotion && (
                    <div className="max-w-4xl mx-auto mt-8">
                         <GenreSelector selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />
                         <ResultsDisplay 
                            emotion={emotion}
                            transcription={transcription}
                            prompts={prompts}
                            generatedImage={generatedImage}
                            musicTrack={musicTrack}
                            onSaveImage={handleSaveImage}
                            isLoggedIn={!!user}
                         />
                    </div>
                )}
            </main>

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={(u) => { setUser(u); setShowLogin(false); }} onSwitchToSignup={openSignup} onForgotPassword={openForgotPassword} />}
            {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSignup={(u) => { setUser(u); setShowSignup(false); }} onSwitchToLogin={openLogin} />}
            {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} onSwitchToLogin={openLogin} />}
            {showGallery && user && <Gallery user={user} onClose={() => setShowGallery(false)} />}
        </div>
    );
};

export default App;
