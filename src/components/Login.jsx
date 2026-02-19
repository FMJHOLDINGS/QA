import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Lock, User, Factory, ChevronDown, Loader2 } from 'lucide-react';
import { db } from '../services/db';
import { cn } from '../lib/utils';

const Login = () => {
    const { login } = useAuth();
    const { theme, setTheme } = useTheme();

    const [loginType, setLoginType] = useState('factory');
    const [factories, setFactories] = useState([]);
    const [selectedFactoryId, setSelectedFactoryId] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoadingFactories, setIsLoadingFactories] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        // Load factories async
        const loadFactories = async () => {
            setIsLoadingFactories(true);
            try {
                // FIXED: db.getFactories -> db.getAllFactories
                const list = await db.getAllFactories();
                setFactories(list);
                if (list.length > 0) {
                    setSelectedFactoryId(list[0].id);
                }
            } catch (err) {
                console.error("Failed to load factories", err);
            } finally {
                setIsLoadingFactories(false);
            }
        };
        loadFactories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        const result = await login(loginType, username, password, selectedFactoryId);

        if (!result.success) {
            setError(result.message);
        }
        setIsLoggingIn(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-slate-800 dark:text-slate-200 hover:bg-white/30 transition-all"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-slate-700 overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <Factory className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">Production Rejection Analysis System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Login Type Selection */}
                        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex">
                            <button
                                type="button"
                                onClick={() => { setLoginType('factory'); setError(''); }}
                                className={cn(
                                    "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                                    loginType === 'factory'
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                Factory Login
                            </button>
                            <button
                                type="button"
                                onClick={() => { setLoginType('admin'); setError(''); }}
                                className={cn(
                                    "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                                    loginType === 'admin'
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                Super Admin
                            </button>
                        </div>

                        {/* Factory Dropdown */}
                        {loginType === 'factory' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Select Factory
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Factory className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        value={selectedFactoryId}
                                        onChange={(e) => setSelectedFactoryId(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-slate-900 dark:text-white appearance-none"
                                        required
                                        disabled={isLoadingFactories}
                                    >
                                        {isLoadingFactories && <option>Loading...</option>}
                                        {!isLoadingFactories && factories.length === 0 && <option value="">No factories found</option>}
                                        {factories.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {isLoadingFactories ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all text-slate-900 dark:text-white"
                                    placeholder={loginType === 'admin' ? "admin" : "Factory username"}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all text-slate-900 dark:text-white"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoggingIn || (loginType === 'factory' && factories.length === 0)}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoggingIn ? 'Logging in...' : (loginType === 'admin' ? 'Login as Admin' : 'Login to Factory')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;