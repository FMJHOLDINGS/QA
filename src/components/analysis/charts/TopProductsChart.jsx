import React from 'react';
import { AlertCircle } from 'lucide-react';

const TopProductsChart = ({ data, maxVal }) => {
    const fmt = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[450px]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-orange-500" /> Top Defective Items
            </h3>
            <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="group">
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{index + 1}. {item.name}</span>
                                <span className="text-slate-900 dark:text-white">{fmt(item.value)} kg</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full transition-all duration-1000 group-hover:bg-orange-400" style={{ width: `${(item.value / (maxVal || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default TopProductsChart;