import React, { useState } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';
import { CloseIcon } from './icons';
import Loader from './Loader';

interface SignupModalProps {
    onClose: () => void;
    onSignup: (user: User) => void;
    onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignup, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if(password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }
        try {
            const user = authService.signup(email, username, password);
            onSignup(user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleSignup = () => {
        try {
            const user = authService.signupWithGoogle();
            onSignup(user);
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
                {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
                    <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
                    <button type="submit" disabled={loading} className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors disabled:bg-gray-500 flex justify-center">
                        {loading ? <Loader className="w-6 h-6" /> : 'Sign Up'}
                    </button>
                </form>
                <div className="text-center my-4 text-gray-400">or</div>
                <button onClick={handleGoogleSignup} className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors">Sign up with Google</button>
                <p className="text-center mt-6 text-gray-400 text-sm">
                    Already have an account? <button onClick={onSwitchToLogin} className="text-purple-400 hover:underline">Login</button>
                </p>
            </div>
        </div>
    );
};

export default SignupModal;
