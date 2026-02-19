import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

const DailyTrendChart = ({ data }) => {
    const fmt = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 border border-slate-100 dark:border-slate-700 shadow-xl rounded-xl z-50">
                    <p className="font-bold text-slate-800 dark:text-white mb-1 text-[10px] uppercase tracking-wider">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                            <span className="text-slate-600 dark:text-slate-300 font-medium capitalize">{entry.name}:</span>
                            <span className="font-bold text-slate-900 dark:text-white ml-auto">{fmt(entry.value)} kg</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary"/> Daily Trends
                </h3>
                <div className="flex gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div> Prod</div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-500"></div> Rej</div>
                </div>
            </div>
            
            <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={1}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                        
                        <XAxis 
                            dataKey="dateLabel" 
                            stroke="#94a3b8" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false} 
                            interval="preserveStartEnd" 
                        />
                        
                        <YAxis 
                            stroke="#94a3b8" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val} 
                        />
                        
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)', radius: 4 }} />
                        
                        {/* වෙනස්කම: minPointSize={3} එකතු කර ඇත */}
                        <Bar dataKey="Production" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={8} minPointSize={3} />
                        <Bar dataKey="Rejection" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={8} minPointSize={3} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default DailyTrendChart;