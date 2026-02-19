import React, { useState } from 'react';
import { 
    Plus, Trash2, Tag, Layers, ChevronDown, AlertCircle, Bookmark 
} from 'lucide-react';

// DYNAMIC_COLORS: Light සහ Dark Mode දෙකටම ගැලපෙන ලෙස වර්ණ සකසා ඇත
const DYNAMIC_COLORS = [
    { color: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
    { color: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
    { color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    { color: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
    { color: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
    { color: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400' },
    { color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    { color: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' },
    { color: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400' },
    { color: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400' },
];

const RejectionSettings = ({ 
    categories, 
    onAdd, 
    onDelete,
    mainCategories = [], 
    onAddMainCategory,
    onDeleteMainCategory 
}) => {
    // State for Rejection (Sub Category)
    const [name, setName] = useState('');
    const [selectedType, setSelectedType] = useState('');

    // State for Main Category
    const [mainCatName, setMainCatName] = useState('');

    // Handle Submit: Sub Category (Rejection)
    const handleSubmitRejection = (e) => {
        e.preventDefault();
        if (name && selectedType) {
            onAdd({ 
                id: Date.now().toString(), 
                name, 
                type: selectedType 
            });
            setName('');
            setSelectedType('');
        }
    };

    // 🎨 Handle Submit: Main Category (අලුත් Logic එක - එකම පාට දෙවරක් නොගැනීම)
    const handleSubmitMainCategory = (e) => {
        e.preventDefault();
        if (mainCatName) {
            // දැනට පාවිච්චි කර ඇති පාට ලැයිස්තුවක් හදාගැනීම
            const usedColors = mainCategories.map(cat => cat.color);
            
            // පාවිච්චි කර නැති (ඉතිරිව ඇති) පාට මොනවාදැයි සෙවීම
            const availableColors = DYNAMIC_COLORS.filter(c => !usedColors.includes(c.color));

            // ඉතිරි පාට තියෙනවා නම් එයින් එකක් ගැනීම, නැත්නම් මුලින්ම තියෙන ලිස්ට් එකෙන් එකක් ගැනීම
            const colorPool = availableColors.length > 0 ? availableColors : DYNAMIC_COLORS;
            const randomColorObj = colorPool[Math.floor(Math.random() * colorPool.length)];

            onAddMainCategory({
                id: Date.now().toString(),
                label: mainCatName.toUpperCase(), 
                color: randomColorObj.color,
                text: randomColorObj.text
            });
            setMainCatName('');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 animate-in fade-in duration-300 items-start">
            
            {/* =========================================================
                LEFT COLUMN : MANAGE MAIN CATEGORIES
            ========================================================= */}
            <div className="lg:col-span-5 xl:col-span-4 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 lg:sticky lg:top-6">
                <div className="mb-5 flex items-center gap-2">
                    <Bookmark className="text-primary h-5 w-5" />
                    <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                        Manage Main Categories
                    </h2>
                </div>

                <form onSubmit={handleSubmitMainCategory} className="flex flex-col gap-3 mb-6">
                    <input 
                        type="text" 
                        placeholder="e.g. OPERATOR ISSUES" 
                        value={mainCatName}
                        onChange={e => setMainCatName(e.target.value)}
                        className="w-full px-4 h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                    <button 
                        type="submit" 
                        disabled={!mainCatName}
                        className="w-full h-11 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-sm font-bold shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> Add Main Category
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    {mainCategories.length === 0 ? (
                        <p className="text-xs text-slate-500 w-full text-center py-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            No main categories added yet.
                        </p>
                    ) : (
                        mainCategories.map(cat => (
                            <div key={cat.id} className="group flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-3 pr-1 py-1 shadow-sm w-full sm:w-auto">
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cat.color || 'bg-slate-500'}`}></div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex-grow truncate">{cat.label}</span>
                                <button 
                                    onClick={() => onDeleteMainCategory(cat.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0"
                                    title="Delete Main Category"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>


            {/* =========================================================
                RIGHT COLUMN : MANAGE REJECTIONS
            ========================================================= */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                    <div className="mb-5 flex items-center gap-2">
                        <Tag className="text-primary h-5 w-5" />
                        <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                            Manage Rejection Types
                        </h2>
                    </div>

                    <form onSubmit={handleSubmitRejection}>
                        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                            
                            <div className="flex-1 w-full">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                                    Rejection Name
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Oil Stain" 
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-4 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="w-full lg:w-64 xl:w-72">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                                    Assign to Main Category
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Layers className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full pl-9 pr-8 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {mainCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={!name || !selectedType || mainCategories.length === 0}
                                className="w-full lg:w-auto h-11 px-6 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> <span className="lg:hidden">Add Rejection</span> <span className="hidden lg:inline">Add</span>
                            </button>
                        </div>
                        {mainCategories.length === 0 && (
                            <p className="text-xs text-amber-500 mt-3 font-medium flex items-center gap-1.5">
                                <AlertCircle size={14} /> Please add a Main Category first to create rejections.
                            </p>
                        )}
                    </form>
                </div>

                <div className="bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl p-1">
                    <div className="flex items-center justify-between px-2 mb-4 mt-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Rejections</h3>
                        <span className="text-[10px] bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                            {categories.length} Items
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {categories.length === 0 && (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50">
                                <AlertCircle className="text-slate-300 mb-3" size={36} />
                                <p className="text-sm font-medium text-slate-400">No rejections found</p>
                            </div>
                        )}

                        {categories.map((item) => {
                            const config = mainCategories.find(c => c.id === item.type) || { label: 'Unknown Category', color: 'bg-slate-400', text: 'text-slate-500' };
                            
                            return (
                                <div key={item.id} className="group relative flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200">
                                    <div className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full ${config.color}`}></div>

                                    <div className="pl-4 flex flex-col overflow-hidden pr-2">
                                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                                            {item.name}
                                        </span>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-wide mt-1 truncate ${config.text}`}>
                                            {config.label}
                                        </span>
                                    </div>

                                    <button 
                                        onClick={() => onDelete(item.id)} 
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 flex-shrink-0"
                                        title="Delete Rejection"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default RejectionSettings;