import React from 'react';
import { RotateCcw } from 'lucide-react';

const ReturnsView = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
                <RotateCcw size={48} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Product Returns</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                Manage product returns and quality checks for returned goods here.
            </p>
            <button className="mt-6 px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Coming Soon
            </button>
        </div>
    );
};

export default ReturnsView;