import React, { useState, useEffect, useMemo } from 'react';
import { useDataEntry } from './DataEntrylogic';
import { 
    Calendar, Sun, Moon, Plus, Trash2, 
    AlertCircle, X, List, Activity, Layers 
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Rejection Modal (Popup with Dropdown) ---
const RejectionModal = ({ isOpen, onClose, initialData, onSave, categories = [] }) => {
    const [items, setItems] = useState(initialData || []);
    const [newItem, setNewItem] = useState({ category: '', qty: '' });

    useEffect(() => {
        if (isOpen) setItems(initialData || []);
    }, [isOpen, initialData]);

    const handleAddItem = () => {
        if (!newItem.category || !newItem.qty) return;

        // අලුත් වෙනස: එකම Category එක දෙපාරක් ඇතුලත් කිරීම වැලැක්වීම
        const isDuplicate = items.some(item => item.category === newItem.category);
        if (isDuplicate) {
            alert("This Rejection Category has already been entered");
            return;
        }

        setItems([...items, { ...newItem, qty: Number(newItem.qty) }]);
        setNewItem({ category: '', qty: '' });
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totalQty = items.reduce((acc, item) => acc + item.qty, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-lg">
                            <AlertCircle className="text-red-500" size={20} />
                            Rejection Breakdown
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Categorize the defects found</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    <div className="flex gap-3">
                        {/* Rejection Category Dropdown */}
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm appearance-none"
                        >
                            <option value="">Select Reason</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Qty"
                            value={newItem.qty}
                            onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                            className="w-20 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm px-3 py-3 outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm text-center"
                        />
                        <button 
                            onClick={handleAddItem}
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                        {items.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                <p className="text-slate-400 text-sm">No defects recorded yet</p>
                            </div>
                        )}
                        {items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 group hover:border-red-500/30 transition-colors">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.category}</span>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-red-600 dark:text-red-400">{item.qty}</span>
                                    <button onClick={() => handleRemoveItem(idx)} className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Total Defects: <span className="text-red-600 dark:text-red-400 text-lg ml-2">{totalQty}</span>
                    </div>
                    <button 
                        onClick={() => onSave(items)}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-lg"
                    >
                        Save Entry
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Row Card (View with Logic) ---
const ProductionRowCard = ({ id, data, onChange, onRemove, settings }) => {
    const [isRejectionModalOpen, setRejectionModalOpen] = useState(false);

    // 1. Get Unique Machines from Settings
    const uniqueMachines = useMemo(() => {
        const machines = settings.products?.map(p => p.machineNo) || [];
        return [...new Set(machines)];
    }, [settings.products]);

    // 2. Filter Products based on Selected Machine
    const availableProducts = useMemo(() => {
        if (!data.machineNo) return [];
        return settings.products?.filter(p => p.machineNo === data.machineNo) || [];
    }, [settings.products, data.machineNo]);

    // 3. Handle Product Change (Auto-fill Weight & Customer)
    const handleProductChange = (e) => {
        const selectedProdName = e.target.value;
        onChange(id, 'productName', selectedProdName);

        // Find weight and customer
        const product = availableProducts.find(p => p.productName === selectedProdName);
        if (product) {
            onChange(id, 'weight', product.weight);
            onChange(id, 'customer', product.customer || ''); 
        } else {
            onChange(id, 'weight', '');
            onChange(id, 'customer', ''); 
        }
    };

    const rejectionTotal = Number(data.rejectionQty) || 0;

    const handleRejectionSave = (items) => {
        const total = items.reduce((acc, i) => acc + i.qty, 0);
        onChange(id, 'rejectionQty', total); 
        onChange(id, 'rejectionDetails', items);
        setRejectionModalOpen(false);
    };

    return (
        <div className="group relative grid grid-cols-12 sm:grid-cols-[1fr_2fr_3fr_1fr_1.5fr_2fr_auto] gap-3 items-center p-3 bg-white dark:bg-[#1e293b]/40 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md">
            
            {/* 1. Machine (Dropdown) */}
            <div className="col-span-2 sm:col-span-1">
                <select
                    value={data.machineNo}
                    onChange={(e) => {
                        onChange(id, 'machineNo', e.target.value);
                        onChange(id, 'productName', ''); // Reset product on machine change
                        onChange(id, 'weight', '');
                        onChange(id, 'customer', ''); // Reset customer on machine change
                    }}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-950/50 border-none rounded-lg text-center text-xs font-bold text-slate-700 dark:text-white focus:ring-1 focus:ring-primary uppercase appearance-none cursor-pointer"
                >
                    <option value="">M-#</option>
                    {uniqueMachines.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            {/* 2. Operator */}
            <div className="col-span-3 sm:col-span-1">
                <input
                    type="text"
                    placeholder="Operator Name"
                    value={data.operatorName}
                    onChange={(e) => onChange(id, 'operatorName', e.target.value)}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-950/50 border-none rounded-lg px-3 text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary placeholder:text-slate-400"
                />
            </div>

            {/* 3. Product (Filtered Dropdown) - Customer combined into option text */}
            <div className="col-span-3 sm:col-span-1">
                <select
                    value={data.productName}
                    onChange={handleProductChange}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-950/50 border-none rounded-lg px-3 text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary cursor-pointer appearance-none truncate"
                    disabled={!data.machineNo}
                >
                    <option value="">Select Product</option>
                    {availableProducts.map(p => (
                        // Customer නම වරහන් ඇතුලේ පෙන්වීමට සකසා ඇත (උදා: 500ML DETTOL (RBL))
                        <option key={p.id} value={p.productName}>
                            {p.productName} {p.customer ? `(${p.customer})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* 4. Weight (Auto-Filled) */}
            <div className="col-span-2 sm:col-span-1">
                <div className="relative">
                    <input
                        type="number"
                        placeholder="0"
                        value={data.weight}
                        onChange={(e) => onChange(id, 'weight', e.target.value)}
                        className="w-full h-9 bg-slate-50 dark:bg-slate-950/50 border-none rounded-lg pl-2 pr-4 text-center text-xs font-medium focus:ring-1 focus:ring-primary placeholder:text-slate-400"
                    />
                    <span className="absolute right-1 top-2.5 text-[9px] text-slate-400 font-bold">g</span>
                </div>
            </div>

            {/* 5. Production */}
            <div className="col-span-2 sm:col-span-1">
                <input
                    type="number"
                    placeholder="Qty"
                    value={data.productionQty}
                    onChange={(e) => onChange(id, 'productionQty', e.target.value)}
                    className="w-full h-9 bg-green-50/50 dark:bg-green-900/10 border border-transparent dark:border-green-900/20 rounded-lg text-center text-xs font-bold text-green-700 dark:text-green-400 focus:ring-1 focus:ring-green-500 focus:bg-green-100 dark:focus:bg-green-900/30 placeholder:text-green-700/30 transition-all"
                />
            </div>

            {/* 6. Rejection */}
            <div className="col-span-12 sm:col-span-1 mt-2 sm:mt-0">
                <button
                    onClick={() => setRejectionModalOpen(true)}
                    className={cn(
                        "w-full h-9 rounded-lg flex items-center justify-between px-3 text-xs transition-all border",
                        rejectionTotal > 0 
                            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold shadow-sm"
                            : "bg-slate-50 dark:bg-slate-950/50 border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    <span className="truncate">
                         {rejectionTotal > 0 ? `${rejectionTotal} Rejects` : "No Rejects"}
                    </span>
                    <List size={14} className={rejectionTotal > 0 ? "opacity-100" : "opacity-30"} />
                </button>
            </div>

            {/* 7. Delete Button */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 sm:col-span-1 flex justify-center w-8">
                <button 
                    onClick={() => onRemove(id)} 
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                    title="Delete Row"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <RejectionModal 
                isOpen={isRejectionModalOpen} 
                onClose={() => setRejectionModalOpen(false)}
                initialData={data.rejectionDetails}
                onSave={handleRejectionSave}
                categories={settings.rejectionCategories} // Pass categories here
            />
        </div>
    );
};

// --- Header Row ---
const HeaderRow = () => (
    <div className="hidden sm:grid grid-cols-[1fr_2fr_3fr_1fr_1.5fr_2fr_auto] gap-3 px-3 py-2 mb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest select-none">
        <div className="text-center">Machine</div>
        <div>Operator</div>
        <div>Product Info</div>
        <div className="text-center">Weight</div>
        <div className="text-center text-green-600/70 dark:text-green-500/70">Production</div>
        <div className="text-center text-red-500/70">Defects</div>
        <div className="w-8"></div> 
    </div>
);

// --- Main Component ---
const DataEntryForm = () => {
    // settings ටික hook එකෙන් ගන්නවා
    const { 
        selectedDate, setSelectedDate, 
        dayRows, nightRows, 
        addRow, updateRow, removeRow,
        settings 
    } = useDataEntry();

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0b1120]">
            {/* Header */}
            <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-20 transition-colors">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                            <Layers size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                Daily Production & Quality Log
                            </h2>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Monitor output and defects in real-time
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-[#1e293b] p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                            <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent border-none p-0 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer"
                            />
                        </div>
                        <div className="px-2 text-xs font-medium text-slate-400 hidden sm:block">
                            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                <div className="max-w-7xl mx-auto space-y-8 pb-10">
                    
                    {/* Day Shift */}
                    <section className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20">
                                    <Sun size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Day Shift</h3>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">06:00 AM - 06:00 PM</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => addRow('Day')} 
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:shadow-lg active:scale-95 transition-all"
                            >
                                <Plus size={16} /> <span className="hidden sm:inline">Add Entry</span>
                            </button>
                        </div>

                        {dayRows.length > 0 && <HeaderRow />}

                        <div className="space-y-3">
                            {dayRows.length === 0 && (
                                <div onClick={() => addRow('Day')} className="group cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center hover:border-orange-400 dark:hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <Activity size={24} className="text-slate-400 group-hover:text-orange-500" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No Day Shift data yet</p>
                                    <p className="text-xs text-slate-400 mt-1">Tap to start logging production</p>
                                </div>
                            )}
                            {dayRows.map(row => (
                                <ProductionRowCard 
                                    key={row.id} id={row.id} data={row}
                                    onChange={(id, f, v) => updateRow(id, f, v)}
                                    onRemove={(id) => removeRow(id)}
                                    settings={settings} // Pass settings down
                                />
                            ))}
                        </div>
                    </section>

                    {/* Night Shift */}
                    <section className="animate-in slide-in-from-bottom-4 duration-500 delay-75">
                         <div className="relative py-4 mb-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                            <div className="relative flex justify-center"><span className="bg-slate-50 dark:bg-[#0b1120] px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Shift Change</span></div>
                        </div>

                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Night Shift</h3>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">06:00 PM - 06:00 AM</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => addRow('Night')} 
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:shadow-lg active:scale-95 transition-all"
                            >
                                <Plus size={16} /> <span className="hidden sm:inline">Add Entry</span>
                            </button>
                        </div>

                        {nightRows.length > 0 && <HeaderRow />}

                        <div className="space-y-3">
                            {nightRows.length === 0 && (
                                <div onClick={() => addRow('Night')} className="group cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <Activity size={24} className="text-slate-400 group-hover:text-indigo-500" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No Night Shift data yet</p>
                                    <p className="text-xs text-slate-400 mt-1">Tap to start logging production</p>
                                </div>
                            )}
                            {nightRows.map(row => (
                                <ProductionRowCard 
                                    key={row.id} id={row.id} data={row}
                                    onChange={(id, f, v) => updateRow(id, f, v)}
                                    onRemove={(id) => removeRow(id)}
                                    settings={settings} // Pass settings down
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DataEntryForm;