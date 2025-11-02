import React, { useState } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';
import { CloseIcon } from './icons';
import Loader from './Loader';

interface LoginModalProps {
    onClose: () => void;
    onLogin: (user: User) => void;
    onSwitchToSignup: () => void;
    onForgotPassword: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, onSwitchToSignup, onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = authService.login(email, password);
            onLogin(user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleLogin = () => {
        try {
            const user = authService.loginWithGoogle();
            onLogin(user);
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
                <h2 className="text-2xl font-bold text-center mb-6">Login to HeartSync AI</h2>
                {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
                    <button type="submit" disabled={loading} className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors disabled:bg-gray-500 flex justify-center">
                        {loading ? <Loader className="w-6 h-6" /> : 'Login'}
                    </button>
                </form>
                <div className="text-center my-4 text-gray-400">or</div>
                <button onClick={handleGoogleLogin} className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors">Login with Google</button>
                <div className="text-center mt-6 text-sm">
                    <p className="text-gray-400">
                        Don't have an account? <button onClick={onSwitchToSignup} className="text-purple-400 hover:underline">Sign up</button>
                    </p>
                    <p className="text-gray-400 mt-2">
                        <button onClick={onForgotPassword} className="hover:underline">Forgot password?</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
