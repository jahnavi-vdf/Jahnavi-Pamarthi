import { User } from '../types';

const USERS_KEY = 'heart_sync_users_v2';
const CURRENT_USER_KEY = 'heart_sync_currentUser_v2';

// In a real app, this would be a secure backend operation.
// We simulate a "hashed" password for this example.
const fakeHash = (password: string) => `hashed_${password}`;

const getUsers = (): Record<string, {password: string, username: string}> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

// --- Public API ---

export const signup = (email: string, username: string, password: string): User => {
    if (!email || !password || !username) {
        throw new Error('Email, username, and password are required.');
    }
    const users = getUsers();
    if (users[email]) {
        throw new Error('An account with this email already exists.');
    }
    if (Object.values(users).some(u => u.username === username)) {
         throw new Error('This username is already taken.');
    }
    
    users[email] = { password: fakeHash(password), username };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const newUser: User = { email, username };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return newUser;
};

export const login = (email: string, password: string): User => {
    const users = getUsers();
    const storedUser = users[email];
    if (!storedUser || storedUser.password !== fakeHash(password)) {
        throw new Error('Invalid email or password.');
    }
    
    const user: User = { email, username: storedUser.username };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    
    return user;
};

// --- Simulated Social & Forgot Password ---

export const signupWithGoogle = (): User => {
    // Simulate creating/logging in a user with a fake Google account
    const email = `user${Math.floor(Math.random() * 10000)}@gmail.com`;
    const username = email.split('@')[0];
    const user: User = { email, username, isGoogleUser: true };

    // We don't need to save this to the `users` db since we can't verify their password
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
};

export const loginWithGoogle = signupWithGoogle; // The simulation is the same

export const forgotPassword = (email: string): void => {
    const users = getUsers();
    if (!users[email]) {
        // In a real app, you wouldn't reveal if the email exists.
        // But for simulation, we can throw an error.
        throw new Error("No account found with that email address.");
    }
    // Simulate sending a password reset email.
    console.log(`Password reset link sent to ${email} (simulation).`);
};


export const logout = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};