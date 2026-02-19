import React from 'react';
import { MessageSquareWarning } from 'lucide-react';

const ComplaintView = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-full mb-4">
                <MessageSquareWarning size={48} className="text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Customer Complaints</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                Log and track customer complaints here. This module is currently under development.
            </p>
            <button className="mt-6 px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Coming Soon
            </button>
        </div>
    );
};

export default ComplaintView;