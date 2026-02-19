import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Target } from 'lucide-react';

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444', '#64748b', '#0ea5e9', '#d946ef'];

const SpecificDefectsChart = ({ data }) => {
    const fmt = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 border border-slate-100 dark:border-slate-700 shadow-xl rounded-xl z-50">
                    <p className="font-bold text-slate-800 dark:text-white mb-1 text-[10px]">{payload[0].payload.name}</p>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{fmt(payload[0].value)} kg</span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[450px]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target size={16} className="text-purple-500" /> Specific Defects (Kg)
            </h3>
            <div className="flex-grow w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid horizontal={false} stroke="#e2e8f0" opacity={0.3} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}/>
                        <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)', radius: 4 }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14} background={{ fill: 'rgba(241, 245, 249, 0.1)', radius: 4 }}>
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default SpecificDefectsChart;