import React, { useState } from 'react';

interface TextInputProps {
    onAnalyze: (text: string) => void;
    disabled: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onAnalyze, disabled }) => {
    const [text, setText] = useState('');

    const handleAnalyzeClick = () => {
        if (text.trim()) {
            onAnalyze(text);
        }
    };

    return (
        <div className="flex flex-col">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe how you're feeling, a situation, or a dream..."
                className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                disabled={disabled}
            />
            <button
                onClick={handleAnalyzeClick}
                disabled={!text.trim() || disabled}
                className="mt-4 w-full px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                Analyze Emotion
            </button>
        </div>
    );
};

export default TextInput;
