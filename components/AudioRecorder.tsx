import React, { useState, useRef, useEffect } from 'react';
import { MicIcon, StopIcon, RedoIcon } from './icons';

interface AudioRecorderProps {
    onAnalyze: (data: { base64: string, mimeType: string }) => void;
    disabled: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAnalyze, disabled }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop()); // Stop microphone access
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setAudioBlob(null);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access the microphone. Please check your browser permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const resetRecording = () => {
        setAudioBlob(null);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setIsRecording(false);
    }

    const handleAnalyzeClick = () => {
        if (audioBlob) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                onAnalyze({ base64: base64String, mimeType: audioBlob.type });
            };
            reader.readAsDataURL(audioBlob);
        }
    };
    
    return (
        <div className="flex flex-col items-center">
            {!isRecording && !audioBlob && (
                <button onClick={startRecording} disabled={disabled} className="flex flex-col items-center justify-center w-full h-40 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <MicIcon className="w-16 h-16 text-red-500" />
                    <span className="mt-2 font-semibold">Tap to Record</span>
                </button>
            )}

            {isRecording && (
                <button onClick={stopRecording} className="flex flex-col items-center justify-center w-full h-40 bg-gray-700 rounded-lg">
                    <StopIcon className="w-16 h-16 text-red-500 animate-pulse" />
                    <span className="mt-2 font-semibold">Recording... Tap to Stop</span>
                </button>
            )}

            {audioBlob && audioUrl && (
                <div className="w-full text-center">
                    <p className="mb-2">Recording complete.</p>
                    <audio src={audioUrl} controls className="w-full mb-4" />
                    <div className="flex space-x-2">
                        <button onClick={resetRecording} disabled={disabled} className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors">
                           <RedoIcon className="w-5 h-5 mr-2" />
                           Record Again
                        </button>
                         <button
                            onClick={handleAnalyzeClick}
                            disabled={disabled}
                            className="flex-1 px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-500 transition-colors"
                        >
                            Analyze Emotion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
