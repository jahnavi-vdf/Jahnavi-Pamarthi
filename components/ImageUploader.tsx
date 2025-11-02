import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
    onAnalyze: (data: { base64: string, mimeType: string }) => void;
    disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze, disabled }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleAnalyzeClick = () => {
        if (file && preview) {
            // preview is a data URL like "data:image/jpeg;base64,...."
            // We need to extract the base64 part.
            const base64String = preview.split(',')[1];
            onAnalyze({ base64: base64String, mimeType: file.type });
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div 
                className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain rounded-md" />
                ) : (
                    <div className="text-center text-gray-400">
                        <UploadIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Click to upload an image</p>
                        <p className="text-xs">PNG, JPG, WEBP</p>
                    </div>
                )}
            </div>
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
            <button
                onClick={handleAnalyzeClick}
                disabled={!file || disabled}
                className="mt-4 w-full px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                Analyze Emotion
            </button>
        </div>
    );
};

export default ImageUploader;
