import React from 'react';
import { InputMode } from '../types';
import { ImageIcon, TextIcon, AudioIcon } from './icons';

interface InputTabsProps {
    currentMode: InputMode;
    onModeChange: (mode: InputMode) => void;
}

const tabs: { mode: InputMode; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { mode: 'text', label: 'Text', icon: TextIcon },
    { mode: 'image', label: 'Image', icon: ImageIcon },
    { mode: 'audio', label: 'Audio', icon: AudioIcon },
];

const InputTabs: React.FC<InputTabsProps> = ({ currentMode, onModeChange }) => {
    return (
        <div className="flex justify-center space-x-2 bg-gray-700 p-1 rounded-lg">
            {tabs.map(({ mode, label, icon: Icon }) => (
                <button
                    key={mode}
                    onClick={() => onModeChange(mode)}
                    className={`
                        w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                        ${currentMode === mode 
                            ? 'bg-purple-600 text-white shadow' 
                            : 'text-gray-300 hover:bg-gray-600/50'
                        }
                    `}
                >
                    <Icon className="w-5 h-5 mr-2" />
                    {label}
                </button>
            ))}
        </div>
    );
};

export default InputTabs;
