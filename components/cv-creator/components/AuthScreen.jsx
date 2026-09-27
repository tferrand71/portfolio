import React, { useState } from 'react';
import { FileText, LogIn, UserPlus, Eye } from 'lucide-react';
import { signIn, signUp } from '../api';

/**
 * Écran d'entrée de CV Creator.
 * Tant qu'on n'est pas passé par ici, aucune donnée de CV n'est chargée :
 * c'est ce qui empêche de retomber sur le document de quelqu'un d'autre.
 */
export default function AuthScreen({ onAuthenticated, onTryWithoutAccount }) {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isSignup = mode === 'signup';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = isSignup
                ? await signUp(username.trim(), password)
                : await signIn(username.trim(), password);
            onAuthenticated(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-3 mb-8 text-blue-600">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <FileText size={28} />
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl text-gray-800 leading-tight">CV Generator Pro</h1>
                        <p className="text-sm text-gray-400 font-medium">
                            Votre CV, rattaché à votre compte
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
                >
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); }}
                            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                                !isSignup ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Connexion
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('signup'); setError(''); }}
                            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                                isSignup ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Créer un compte
                        </button>
                    </div>

                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Pseudo
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                        className="w-full mb-4 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={isSignup ? 'new-password' : 'current-password'}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {isSignup && (
                        <p className="text-xs text-gray-400 mt-2">8 caractères minimum.</p>
                    )}

                    {error && (
                        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-slate-200"
                    >
                        {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
                        {loading ? 'Un instant…' : isSignup ? 'Créer mon compte' : 'Se connecter'}
                    </button>
                </form>

                <button
                    onClick={onTryWithoutAccount}
                    className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 py-3 transition-colors"
                >
                    <Eye size={16} />
                    Essayer sans compte (rien ne sera sauvegardé)
                </button>
            </div>
        </div>
    );
}
