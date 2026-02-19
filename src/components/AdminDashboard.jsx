import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { createFactoryData } from '../types'; // Import Type Helper
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Users, Plus, LogOut, Moon, Sun, Building2, Factory, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [factories, setFactories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State (Removed 'id' from state as it will be auto-generated)
    const [newFactory, setNewFactory] = useState({ name: '', username: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadFactories = async () => {
        try {
            setLoading(true);
            const list = await db.getAllFactories();
            setFactories(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFactories();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            // --- AUTO ID GENERATION LOGIC ---
            // 1. Remove spaces and special chars from name
            const namePart = newFactory.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            // 2. Append -001 (EX: "A One" -> "AONE-001")
            const generatedId = `${namePart}-001`;

            const factoryData = createFactoryData(
                generatedId, // Auto Generated ID passed here
                newFactory.name, 
                newFactory.username, 
                newFactory.password
            );

            await db.registerFactory(factoryData);
            
            setShowModal(false);
            setNewFactory({ name: '', username: '', password: '' }); // Reset form
            loadFactories();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">System Overview</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-red-200 dark:border-red-900/50">
                                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Registered Factories</h2>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm transition-all transform hover:scale-[1.02]">
                        <Plus size={20} /> Add New Factory
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {factories.map((factory) => (
                            <div key={factory.id} className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{factory.name}</h3>
                                            {/* ID එක මෙතන පෙන්වනවා */}
                                            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded inline-block mt-1">
                                                ID: {factory.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">User:</span>
                                        <span className="font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-700 dark:text-slate-300">{factory.username}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {factories.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400 mt-1">No factories yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-slate-200 dark:border-slate-700">
                            
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Register New Factory</h3>

                            <form onSubmit={handleRegister} className="space-y-4">
                                
                                {/* 1. Factory Name Input (ID Input Removed) */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Factory Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newFactory.name}
                                        onChange={(e) => setNewFactory({ ...newFactory, name: e.target.value })}
                                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3 text-slate-900 dark:text-white"
                                        placeholder="e.g. A One Int Pvt Ltd"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        ID will be auto-generated (e.g. AONEINTPVTLTD-001)
                                    </p>
                                </div>

                                {/* 2. Username */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={newFactory.username}
                                        onChange={(e) => setNewFactory({ ...newFactory, username: e.target.value })}
                                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3 text-slate-900 dark:text-white"
                                        placeholder="e.g. aone_user"
                                    />
                                </div>

                                {/* 3. Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newFactory.password}
                                        onChange={(e) => setNewFactory({ ...newFactory, password: e.target.value })}
                                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3 text-slate-900 dark:text-white"
                                        placeholder="********"
                                    />
                                </div>

                                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                                <div className="mt-5 sm:flex sm:flex-row-reverse gap-2">
                                    <button type="submit" disabled={isSubmitting} className="w-full inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 sm:w-auto">
                                        {isSubmitting ? 'Saving...' : 'Register'}
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;