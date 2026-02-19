import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Layers } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext'; 

// --- Dynamic Colors Only ---
// මෙහි දැන් නම් (Names) සඳහන් කර නැත. එන පිළිවෙලට මේ පාට ටික ලබා දෙයි.
const DYNAMIC_COLORS = [
    '#3b82f6', '#f97316', '#10b981', '#8b5cf6', 
    '#f43f5e', '#eab308', '#14b8a6', '#6366f1',
    '#0ea5e9', '#d946ef'
];

const MainSourceChart = ({ data }) => {
    const { theme } = useTheme(); 
    const [labelColor, setLabelColor] = useState('#374151'); 
    const [isMobile, setIsMobile] = useState(false); 

    // 🎨 Theme සහ Screen Size (Mobile/Desktop) Handle කිරීම
    useEffect(() => {
        const checkIsDark = () => {
            if (theme === 'dark') return true;
            if (theme === 'light') return false;
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        };
        setLabelColor(checkIsDark() ? '#ffffff' : '#374151');

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); 
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, [theme]);

    const fmt = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });

    // 🎨 අලුත් Logic එක: Hardcode කරපු නම් නැති නිසා Index එක අනුව පාට ලබා දෙයි
    const getMainCatColor = (index) => {
        return DYNAMIC_COLORS[index % DYNAMIC_COLORS.length];
    };

    const renderCustomizedLabel = (props) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value, fill } = props;
        const RADIAN = Math.PI / 180;
        
        const radius = outerRadius * 1.12; 
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const textAnchor = x > cx ? 'start' : 'end';
        
        return (
            <text x={x} y={y} textAnchor={textAnchor} dominantBaseline="central" style={{ fontSize: '11px', fontWeight: 'bold' }}>
                <tspan x={x} dy="-1em" fill={labelColor} fontSize="11px" fontWeight="800">
                    {name.split(' ')[0]}
                </tspan>
                <tspan x={x} dy="1.1em" fill={fill} fontSize="12px" fontWeight="700">
                    {fmt(value)} kg
                </tspan>
                <tspan x={x} dy="1.1em" fill="#d97706" fontSize="10px" fontWeight="600">
                    ({(percent * 100).toFixed(0)}%)
                </tspan>
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 border border-slate-100 dark:border-slate-700 shadow-xl rounded-xl z-50">
                    <p className="font-bold text-slate-800 dark:text-white mb-1 text-[10px] uppercase tracking-wider">{payload[0].name}</p>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: payload[0].payload.fill }}></div>
                        <span className="font-bold text-slate-900 dark:text-white">{fmt(payload[0].value)} kg</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-auto min-h-[450px]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Layers size={16} className="text-blue-500" /> Main Sources Breakdown
            </h3>
            
            <div className="flex-grow w-full relative min-w-0 flex flex-col">
                {data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400 flex-grow">No data</div>
                ) : (
                    <>
                        <div className="relative flex-grow min-h-[250px] md:min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={data} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={70} 
                                        outerRadius={105} 
                                        paddingAngle={3} 
                                        dataKey="value"
                                        label={isMobile ? false : renderCustomizedLabel} 
                                        labelLine={isMobile ? false : { stroke: '#cbd5e1', strokeWidth: 1 }}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getMainCatColor(index)} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Center Text (Total KG) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{fmt(totalValue)}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Kg</span>
                            </div>
                        </div>

                        {/* Mobile සඳහා පමණක් පෙනෙන Legend එක */}
                        {isMobile && (
                            <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2">
                                {data.map((entry, index) => {
                                    const percent = totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(0) : 0;
                                    return (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getMainCatColor(index) }}></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase truncate">
                                                    {entry.name.split(' ')[0]}
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                                    {fmt(entry.value)} kg <span className="text-[#d97706]">({percent}%)</span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MainSourceChart;