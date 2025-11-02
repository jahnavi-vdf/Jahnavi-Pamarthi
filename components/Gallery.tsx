import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as galleryService from '../services/galleryService';
import { CloseIcon } from './icons';

interface GalleryProps {
    user: User;
    onClose: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ user, onClose }) => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        setImages(galleryService.getImages(user.email));
    }, [user.email]);
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-4xl h-[90vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6">My Gallery</h2>
                {images.length > 0 ? (
                    <div className="flex-1 overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((imgSrc, index) => (
                            <div key={index} className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                                <img src={imgSrc} alt={`Gallery item ${index}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <p>Your saved images will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
