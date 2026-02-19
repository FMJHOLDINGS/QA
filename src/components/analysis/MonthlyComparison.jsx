import React, { useState, useEffect } from 'react';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, Line, ComposedChart 
} from 'recharts';
import { Loader2, TrendingUp, Calendar } from 'lucide-react';

const MonthlyComparison = ({ rawData }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (!rawData || rawData.length === 0) return;

        // Group by Month (YYYY-MM)
        const monthMap = {};

        rawData.forEach(log => {
            const date = new Date(log.logDate);
            const monthKey = date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
            const weight = Number(log.weight || 0);
            
            const prodKg = (Number(log.productionQty || 0) * weight) / 1000;
            const rejKg = (Number(log.rejectionQty || 0) * weight) / 1000;

            if (!monthMap[monthKey]) {
                monthMap[monthKey] = { 
                    month: monthKey, 
                    Production: 0, 
                    Rejection: 0,
                    sortDate: date // For sorting
                };
            }

            monthMap[monthKey].Production += prodKg;
            monthMap[monthKey].Rejection += rejKg;
        });

        // Calculate Rate & Sort
        const finalData = Object.values(monthMap)
            .sort((a, b) => a.sortDate - b.sortDate)
            .map(d => ({
                ...d,
                Production: Number(d.Production.toFixed(2)),
                Rejection: Number(d.Rejection.toFixed(2)),
                Rate: d.Production > 0 ? Number(((d.Rejection / d.Production) * 100).toFixed(2)) : 0
            }));

        setChartData(finalData);
    }, [rawData]);

    if (chartData.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Calendar size={32} className="mb-2 opacity-50"/>
                <p>Not enough data for monthly comparison</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Avg Production</p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                        {(chartData.reduce((acc, c) => acc + c.Production, 0) / chartData.length).toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-sm">kg/mo</span>
                    </h3>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Avg Rejection</p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                        {(chartData.reduce((acc, c) => acc + c.Rejection, 0) / chartData.length).toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-sm">kg/mo</span>
                    </h3>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Avg Rej Rate</p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                        {(chartData.reduce((acc, c) => acc + c.Rate, 0) / chartData.length).toFixed(2)}%
                    </h3>
                </div>
            </div>

            {/* Comparison Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary"/> Monthly Trends
                </h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Kg', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#f97316" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '5px' }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="Production" fill="#3b82f6" barSize={30} radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="left" dataKey="Rejection" fill="#ef4444" barSize={30} radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="Rate" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default MonthlyComparison;