import React, { useState } from 'react';
import { Plus, Trash2, Database, Package } from 'lucide-react';

const ProductSettings = ({ products, onAdd, onDelete }) => {
    // 1. State එකට 'customer' එකතු කර ඇත
    const [form, setForm] = useState({ machineNo: '', productName: '', customer: '', weight: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.machineNo && form.productName) {
            onAdd({ ...form, id: Date.now().toString() });
            // 2. Submit කිරීමෙන් පසු 'customer' හිස් කිරීමට එකතු කර ඇත
            setForm({ machineNo: '', productName: '', customer: '', weight: '' });
        }
    };

    return (
        <div className="space-y-6">
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[120px]">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Machine No</label>
                    <input 
                        type="text" 
                        placeholder="M-01" 
                        value={form.machineNo}
                        onChange={e => setForm({...form, machineNo: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                <div className="flex-[2] min-w-[200px]">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Product Name</label>
                    <input 
                        type="text" 
                        placeholder="Product Name" 
                        value={form.productName}
                        onChange={e => setForm({...form, productName: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                
                {/* 3. අලුතින් එකතු කරන ලද Customer Input කොටස */}
                <div className="flex-[2] min-w-[150px]">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Customer</label>
                    <input 
                        type="text" 
                        placeholder="Customer Name" 
                        value={form.customer}
                        onChange={e => setForm({...form, customer: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>

                <div className="flex-1 min-w-[100px]">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Weight (g)</label>
                    <input 
                        type="number" 
                        placeholder="0.00" 
                        value={form.weight}
                        onChange={e => setForm({...form, weight: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-colors">
                    <Plus size={20} />
                </button>
            </form>

            {/* List Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-4 py-3">Machine</th>
                            <th className="px-4 py-3">Product Name</th>
                            {/* 4. අලුත් Customer තීරුවක් (Column) වගුවට එකතු කර ඇත */}
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Weight (g)</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 && (
                            <tr>
                                {/* 5. ColSpan එක 4 සිට 5 දක්වා වෙනස් කර ඇත අලුත් තීරුව නිසා */}
                                <td colSpan="5" className="text-center py-8 text-slate-400">No products added yet.</td>
                            </tr>
                        )}
                        {products.map((item) => (
                            <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-none">
                                <td className="px-4 py-3 font-mono font-medium text-slate-700 dark:text-slate-300">{item.machineNo}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.productName}</td>
                                {/* 6. Customer දත්තය පෙන්වීමේ කොටස */}
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.customer}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.weight}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => onDelete(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductSettings;