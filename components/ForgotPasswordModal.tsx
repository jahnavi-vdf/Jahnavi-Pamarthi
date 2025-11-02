import React, { useState } from 'react';
import * as authService from '../services/authService';
import { CloseIcon } from './icons';
import Loader from './Loader';

interface ForgotPasswordModalProps {
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            authService.forgotPassword(email);
            setMessage(`If an account exists for ${email}, a password reset link has been sent.`);
        } catch (err: any) {
            // In a real app, you might not show this error to prevent email enumeration
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
                {message && <p className="bg-green-900/50 text-green-300 p-3 rounded-md mb-4 text-sm">{message}</p>}
                
                {!message && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
                        <button type="submit" disabled={loading} className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors disabled:bg-gray-500 flex justify-center">
                            {loading ? <Loader className="w-6 h-6" /> : 'Send Reset Link'}
                        </button>
                    </form>
                )}
                
                <p className="text-center mt-6 text-gray-400 text-sm">
                    Remembered your password? <button onClick={onSwitchToLogin} className="text-purple-400 hover:underline">Login</button>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
