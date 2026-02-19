import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DataEntryForm from './DataEntryForm';
import AnalysisCharts from './analysis/AnalysisCharts';
import LogsView from './LogsView';
import FactoryAdminView from './FactoryAdminView';
import ComplaintView from './ComplaintView'; // New Import
import ReturnsView from './ReturnsView';     // New Import
import { 
    LayoutDashboard, PenTool, LogOut, Moon, Sun, Factory, 
    FileText, ShieldCheck, MessageSquareWarning, RotateCcw 
} from 'lucide-react';
import { cn } from '../lib/utils';

const FactoryDashboard = () => {
    const { logout, user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('entry');

    // Tab Configuration (Updated Order)
    const TABS = [
        { id: 'entry', label: 'Data Entry', icon: PenTool },
        { id: 'complaint', label: 'Complaints', icon: MessageSquareWarning }, // New
        { id: 'returns', label: 'Returns', icon: RotateCcw },                 // New
        { id: 'analysis', label: 'Analysis', icon: LayoutDashboard },
        { id: 'logs', label: 'Logs', icon: FileText },
        { id: 'admin', label: 'Admin', icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300 flex flex-col font-sans">
            
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-3 md:py-0 gap-4 md:gap-0">
                        <div className="flex items-center self-start md:self-auto">
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg shadow-primary/20 text-white transform transition-transform hover:scale-105 duration-300">
                                    <Factory className="h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Factory Dashboard</h1>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{user?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs (Scrollable on mobile if needed) */}
                        <nav className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 relative overflow-x-auto max-w-full no-scrollbar">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 z-10 whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "text-slate-900 dark:text-white scale-105"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                                    )}
                                >
                                    <tab.icon size={16} className={cn("transition-transform duration-300", activeTab === tab.id ? "text-primary" : "")} />
                                    <span className="hidden lg:inline">{tab.label}</span> {/* Hide text on small screens if space is tight */}
                                    {activeTab === tab.id && (
                                        <div className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-600 -z-10 animate-in zoom-in-95 duration-200" />
                                    )}
                                </button>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3 self-end md:self-auto">
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
                            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-all border border-red-100 dark:border-red-900/30 active:scale-95">
                                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-hidden flex flex-col relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto w-full h-full flex flex-col z-0">
                    <div className="flex-grow transition-all duration-500 ease-in-out">
                        {activeTab === 'entry' && <div className="h-full animate-in slide-in-from-bottom-2 fade-in duration-500"><DataEntryForm /></div>}
                        
                        {/* New Views Rendered Here */}
                        {activeTab === 'complaint' && <div className="h-full animate-in slide-in-from-bottom-2 fade-in duration-500"><ComplaintView /></div>}
                        {activeTab === 'returns' && <div className="h-full animate-in slide-in-from-bottom-2 fade-in duration-500"><ReturnsView /></div>}
                        
                        {activeTab === 'analysis' && <div className="h-full animate-in slide-in-from-bottom-2 fade-in duration-500"><AnalysisCharts /></div>}
                        {activeTab === 'logs' && <div className="h-full animate-in slide-in-from-bottom-2 fade-in duration-500"><LogsView /></div>}
                        {activeTab === 'admin' && <div className="h-full animate-in slide-in-from-bottom-2 fade-in duration-500"><FactoryAdminView /></div>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FactoryDashboard;