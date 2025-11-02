import React from 'react';
import { User } from '../types';
import { LoginIcon, LogoutIcon, UserCircleIcon, GalleryIcon } from './icons';

interface HeaderProps {
    user: User | null;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogout: () => void;
    onGalleryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onSignupClick, onLogout, onGalleryClick }) => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    HeartSync AI
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <button onClick={onGalleryClick} className="flex items-center text-gray-300 hover:text-white transition-colors">
                                <GalleryIcon className="w-5 h-5 mr-2" />
                                My Gallery
                            </button>
                            <div className="flex items-center text-gray-300">
                                <UserCircleIcon className="w-6 h-6 mr-2" />
                                <span>{user.username}</span>
                            </div>
                            <button onClick={onLogout} className="flex items-center text-gray-300 hover:text-white transition-colors">
                                <LogoutIcon className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={onLoginClick} className="flex items-center text-gray-300 hover:text-white transition-colors">
                                <LoginIcon className="w-5 h-5 mr-2" />
                                Login
                            </button>
                            <button onClick={onSignupClick} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
