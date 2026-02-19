import React, { useState, useRef, useEffect } from 'react';
import { useLogsLogic } from './LogsLogic';
import { 
    Calendar, Search, Loader2, ChevronDown, Check, ChevronRight 
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Helper: Format Date ---
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { 
        day: 'numeric', month: 'short', year: 'numeric', weekday: 'short'
    });
};

// --- Multi-Select Dropdown ---
const MultiSelectDropdown = ({ label, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className="relative min-w-[150px]" ref={containerRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-xs font-medium border rounded-lg bg-white dark:bg-slate-900 transition-colors",
                    selected.length > 0 ? "border-primary text-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                )}
            >
                <span className="truncate">
                    {selected.length === 0 ? label : `${selected.length} Selected`}
                </span>
                <ChevronDown size={14} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
                    <div className="p-2 space-y-1">
                        {options.length === 0 ? (
                            <div className="text-xs text-slate-400 p-2 text-center">No options available</div>
                        ) : (
                            options.map(option => (
                                <div 
                                    key={option} 
                                    onClick={() => toggleOption(option)}
                                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded cursor-pointer"
                                >
                                    <div className={cn(
                                        "w-3 h-3 rounded border flex items-center justify-center flex-shrink-0",
                                        selected.includes(option) ? "bg-primary border-primary" : "border-slate-300"
                                    )}>
                                        {selected.includes(option) && <Check size={10} className="text-white" />}
                                    </div>
                                    <span className="text-xs text-slate-700 dark:text-slate-200 truncate">{option}</span>
                                </div>
                            ))
                        )}
                    </div>
                    {selected.length > 0 && (
                        <div className="p-2 border-t border-slate-100 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-800">
                            <button 
                                onClick={() => onChange([])}
                                className="w-full py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                                Clear Selection
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const LogsView = () => {
    const {
        loading, processedData, settings,
        dateRange, setDateRange,
        activeTab, setActiveTab,
        searchTerm, setSearchTerm,
        selectedMachines, setSelectedMachines,
        selectedProducts, setSelectedProducts,
        uniqueMachines, uniqueProducts,
        calculateRejRate, getRejQtyByCategory
    } = useLogsLogic();

    // Mobile Row Expansion State
    const [expandedRows, setExpandedRows] = useState({});
    const toggleRow = (id) => setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <div className="h-full flex flex-col space-y-4 pr-2">
            
            {/* --- 1. Inline Header Controls --- */}
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">
                    
                    {/* Date Picker */}
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <Calendar size={16} className="text-slate-500 ml-1" />
                        <input 
                            type="date" 
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-0 w-24 p-0"
                        />
                        <span className="text-slate-400">-</span>
                        <input 
                            type="date" 
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-0 w-24 p-0"
                        />
                    </div>

                    {/* IM/BM Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg flex-shrink-0">
                        {['IM', 'BM'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setSelectedMachines([]);
                                    setSelectedProducts([]);
                                }}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                                    activeTab === tab
                                        ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block"></div>

                    {/* Filters */}
                    <MultiSelectDropdown 
                        label="Filter Machines" 
                        options={uniqueMachines} 
                        selected={selectedMachines} 
                        onChange={setSelectedMachines} 
                    />
                    <MultiSelectDropdown 
                        label="Filter Products" 
                        options={uniqueProducts} 
                        selected={selectedProducts} 
                        onChange={setSelectedProducts} 
                    />

                    {/* Search */}
                    <div className="relative flex-grow min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary/50 outline-none h-full"
                        />
                    </div>
                </div>
            </div>

            {/* --- 2. Grouped Data Display --- */}
            <div className="flex-grow overflow-y-auto pb-10 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                {loading ? (
                    <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={30} /></div>
                ) : processedData.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">No records found.</div>
                ) : (
                    <div className="space-y-8">
                        {processedData.map(({ date, logs }) => {
                            
                            // Calculate Daily Totals
                            const totals = logs.reduce((acc, log) => {
                                const prodQty = Number(log.productionQty || 0);
                                const rejQty = Number(log.rejectionQty || 0);
                                const weight = Number(log.weight || 0);

                                acc.prodQty += prodQty;
                                acc.rejQty += rejQty;
                                acc.prodWgt += (prodQty * weight);
                                acc.rejWgt += (rejQty * weight);
                                return acc;
                            }, { prodQty: 0, rejQty: 0, prodWgt: 0, rejWgt: 0 });

                            const totalRejRate = calculateRejRate(totals.prodQty, totals.rejQty);
                            // Convert Totals to Kg
                            const totalProdKg = (totals.prodWgt / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            const totalRejKg = (totals.rejWgt / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                            return (
                                <div key={date} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    
                                    {/* Date Header Section */}
                                    <div className="flex items-center gap-3 mb-2 px-1">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-lg shadow-sm">
                                            <Calendar size={14} />
                                            <span className="font-bold text-sm">{formatDate(date)}</span>
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">{logs.length} Entries</span>
                                    </div>

                                    {/* --- DESKTOP TABLE --- */}
                                    <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs text-left whitespace-nowrap">
                                                <thead className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                                    <tr>
                                                        <th className="px-3 py-3">Shift</th>
                                                        <th className="px-3 py-3">Machine</th>
                                                        <th className="px-3 py-3">Operator</th>
                                                        <th className="px-3 py-3">Product</th>
                                                        <th className="px-3 py-3 text-center">Unit(g)</th>
                                                        <th className="px-3 py-3 text-right text-green-600">Prod. Qty</th>
                                                        <th className="px-3 py-3 text-right text-green-600">Prod. Kg</th>
                                                        <th className="px-3 py-3 text-right text-red-500">Rejects</th>
                                                        <th className="px-3 py-3 text-right text-red-500">Rej. Kg</th>
                                                        <th className="px-3 py-3 text-right text-orange-500">Rej %</th>
                                                        
                                                        {settings.rejectionCategories.map(cat => (
                                                            <th key={cat.id} className="px-2 py-3 text-center border-l border-slate-200 dark:border-slate-700 min-w-[70px]">
                                                                {cat.name}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                                    {logs.map((log) => {
                                                        const weight = Number(log.weight || 0);
                                                        const prodQty = Number(log.productionQty || 0);
                                                        const rejQty = Number(log.rejectionQty || 0);
                                                        const prodKg = ((prodQty * weight) / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                        const rejKg = ((rejQty * weight) / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                                                        return (
                                                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                                <td className="px-3 py-2">
                                                                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", log.shiftType === 'Day' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600')}>
                                                                        {log.shiftType}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2 font-mono font-bold text-slate-700 dark:text-slate-300">{log.machineNo}</td>
                                                                <td className="px-3 py-2 text-slate-500">{log.operatorName}</td>
                                                                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{log.productName}</td>
                                                                <td className="px-3 py-2 text-center text-slate-500">{weight}</td>
                                                                <td className="px-3 py-2 text-right font-bold text-slate-700 dark:text-slate-200">{prodQty}</td>
                                                                <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{prodKg}</td>
                                                                <td className="px-3 py-2 text-right font-bold text-red-500">{rejQty}</td>
                                                                <td className="px-3 py-2 text-right text-red-400">{rejKg}</td>
                                                                <td className="px-3 py-2 text-right font-bold text-orange-500">{calculateRejRate(prodQty, rejQty)}%</td>
                                                                
                                                                {settings.rejectionCategories.map(cat => {
                                                                    const qty = getRejQtyByCategory(log, cat.name);
                                                                    return (
                                                                        <td key={cat.id} className="px-2 py-2 text-center border-l border-slate-100 dark:border-slate-800 text-slate-500">
                                                                            {qty > 0 ? qty : '-'}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                    {/* Daily Total Row */}
                                                    <tr className="bg-slate-100 dark:bg-slate-900 font-bold text-slate-800 dark:text-white border-t-2 border-slate-300 dark:border-slate-600">
                                                        <td colSpan="5" className="px-3 py-2 text-right uppercase text-[10px] tracking-wider">Total</td>
                                                        <td className="px-3 py-2 text-right text-green-700">{totals.prodQty}</td>
                                                        <td className="px-3 py-2 text-right text-green-700">{totalProdKg}</td>
                                                        <td className="px-3 py-2 text-right text-red-600">{totals.rejQty}</td>
                                                        <td className="px-3 py-2 text-right text-red-600">{totalRejKg}</td>
                                                        <td className="px-3 py-2 text-right text-orange-600">{totalRejRate}%</td>
                                                        <td colSpan={settings.rejectionCategories.length}></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* --- MOBILE CARD VIEW --- */}
                                    <div className="lg:hidden space-y-3">
                                        {logs.map((log) => (
                                            <div key={log.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", log.shiftType === 'Day' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600')}>
                                                            {log.shiftType}
                                                        </span>
                                                        <span className="font-mono font-bold text-sm text-slate-800 dark:text-white">{log.machineNo}</span>
                                                    </div>
                                                    <span className="text-xs text-slate-400">{log.operatorName}</span>
                                                </div>

                                                <div className="mb-3">
                                                    <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm">{log.productName}</h4>
                                                    <p className="text-[10px] text-slate-400">Unit: {log.weight}g</p>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg mb-2">
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400 uppercase">Prod</span>
                                                        <span className="block font-bold text-green-600 text-sm">{log.productionQty}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400 uppercase">Rejects</span>
                                                        <span className="block font-bold text-red-500 text-sm">{log.rejectionQty}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400 uppercase">Rate</span>
                                                        <span className="block font-bold text-orange-500 text-sm">{calculateRejRate(log.productionQty, log.rejectionQty)}%</span>
                                                    </div>
                                                </div>

                                                {Number(log.rejectionQty) > 0 && (
                                                    <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
                                                        <button 
                                                            onClick={() => toggleRow(log.id)}
                                                            className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-primary"
                                                        >
                                                            <span>View Breakdown</span>
                                                            {expandedRows[log.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                        </button>
                                                        {expandedRows[log.id] && (
                                                            <div className="mt-2 grid grid-cols-2 gap-2 animate-in slide-in-from-top-1">
                                                                {settings.rejectionCategories.map(cat => {
                                                                    const qty = getRejQtyByCategory(log, cat.name);
                                                                    if (qty === 0) return null;
                                                                    return (
                                                                        <div key={cat.id} className="flex justify-between p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                                                                            <span className="text-[10px] text-slate-500 truncate pr-1">{cat.name}</span>
                                                                            <span className="text-[10px] font-bold">{qty}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Mobile Daily Total */}
                                        <div className="bg-slate-800 dark:bg-white p-3 rounded-lg shadow text-white dark:text-slate-900 flex justify-between items-center text-xs">
                                            <span className="uppercase font-bold tracking-wider">Total</span>
                                            <div className="text-right flex gap-3">
                                                <div>Prod: <span className="font-bold">{totals.prodQty}</span></div>
                                                <div>Rej: <span className="font-bold">{totals.rejQty}</span></div>
                                                <div>Rate: <span className="font-bold">{totalRejRate}%</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogsView;