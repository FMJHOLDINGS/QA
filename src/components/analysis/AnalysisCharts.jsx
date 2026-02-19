// src/components/analysis/AnalysisCharts.jsx
import React from 'react';
import { Loader2, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

// Logic Import
import { useAnalysisChartsLogic } from './AnalysisChartsLogic';

// Sub-Components Imports (අපි අලුතෙන් හදන ෆයිල්)
import MonthlyComparison from './MonthlyComparison';
import KPICards from './charts/KPICards';
import DailyTrendChart from './charts/DailyTrendChart';
import SpecificDefectsChart from './charts/SpecificDefectsChart';
import MainSourceChart from './charts/MainSourceChart';
import TopProductsChart from './charts/TopProductsChart';

const AnalysisCharts = () => {
    // 1. Logic එකෙන් Data ගන්නවා
    const { loading, activeView, setActiveView, currentMonthData, rawData } = useAnalysisChartsLogic();

    if (loading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
    }

    if (!rawData || rawData.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <PieIcon size={48} className="mb-2 opacity-20" />
                <p>No production data available.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            
            {/* --- Header & Tabs --- */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-1">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Performance Analytics</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Production & Quality Insights</p>
                </div>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button onClick={() => setActiveView('current')} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all", activeView === 'current' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
                        <PieIcon size={16} /> Current Month
                    </button>
                    <button onClick={() => setActiveView('history')} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all", activeView === 'history' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
                        <TrendingUp size={16} /> Monthly History
                    </button>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="flex-grow overflow-y-auto pr-2 pb-10 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                {activeView === 'current' && currentMonthData ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 1. KPIs */}
                        <KPICards data={currentMonthData} />

                        {/* 2. Daily Trend */}
                        <DailyTrendChart data={currentMonthData.dailyData} />

                        {/* 3. Bottom Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <SpecificDefectsChart data={currentMonthData.pieData} />
                            <MainSourceChart data={currentMonthData.mainPieData} />
                            <TopProductsChart data={currentMonthData.topItems} maxVal={currentMonthData.topItems[0]?.value} />
                        </div>
                    </div>
                ) : (
                    <MonthlyComparison rawData={rawData} />
                )}
            </div>
        </div>
    );
};

export default AnalysisCharts;