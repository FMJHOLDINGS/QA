import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { Package, AlertOctagon, Save, Loader2 } from 'lucide-react';
import ProductSettings from './admin/ProductSettings';
import RejectionSettings from './admin/RejectionSettings';
import { cn } from '../lib/utils';

const FactoryAdminView = () => {
    const { user } = useAuth();
    const [activeSubTab, setActiveSubTab] = useState('products');
    
    // 1. settings state එකේ mainCategories සඳහා empty array එකක් default ලෙස ලබා දී ඇත
    const [settings, setSettings] = useState({ 
        products: [], 
        rejectionCategories: [],
        mainCategories: [] 
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load Settings
    useEffect(() => {
        if (!user?.id) return;
        const load = async () => {
            try {
                const data = await db.getFactorySettings(user.id);
                // 2. data load වෙද්දි mainCategories නැත්නම් empty array එකක් set කරයි
                setSettings({ 
                    products: data?.products || [], 
                    rejectionCategories: data?.rejectionCategories || [],
                    mainCategories: data?.mainCategories || []
                });
            } catch (e) {
                console.error("Failed to load settings", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    // Save Helper
    const saveToDB = async (newSettings) => {
        setSettings(newSettings);
        setSaving(true);
        try {
            await db.saveFactorySettings(user.id, newSettings);
        } catch (e) {
            console.error("Save failed", e);
        } finally {
            setSaving(false);
        }
    };

    // Product Handlers
    const addProduct = (prod) => saveToDB({ ...settings, products: [...(settings.products || []), prod] });
    const deleteProduct = (id) => saveToDB({ ...settings, products: settings.products.filter(p => p.id !== id) });

    // Rejection Handlers (Sub Categories)
    const addRejection = (cat) => saveToDB({ ...settings, rejectionCategories: [...(settings.rejectionCategories || []), cat] });
    const deleteRejection = (id) => saveToDB({ ...settings, rejectionCategories: settings.rejectionCategories.filter(c => c.id !== id) });

    // ==========================================
    // 3. අලුතින් එකතු කල Main Category Handlers
    // ==========================================
    const addMainCategory = (mainCat) => {
        saveToDB({ 
            ...settings, 
            mainCategories: [...(settings.mainCategories || []), mainCat] 
        });
    };

    const deleteMainCategory = (id) => {
        saveToDB({ 
            ...settings, 
            mainCategories: settings.mainCategories.filter(c => c.id !== id) 
        });
    };
    // ==========================================

    if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" size={40}/></div>;

    return (
        <div className="h-full flex flex-col">
            {/* Sub Tabs */}
            <div className="flex items-center gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-1">
                <button
                    onClick={() => setActiveSubTab('products')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeSubTab === 'products' 
                            ? "border-primary text-primary" 
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    <Package size={18} /> Products & Machines
                </button>
                <button
                    onClick={() => setActiveSubTab('rejections')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeSubTab === 'rejections' 
                            ? "border-red-500 text-red-500" 
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    <AlertOctagon size={18} /> Rejection Categories
                </button>
                
                {saving && <span className="ml-auto text-xs text-slate-400 flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Saving...</span>}
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                {activeSubTab === 'products' ? (
                    <ProductSettings 
                        products={settings.products || []} 
                        onAdd={addProduct} 
                        onDelete={deleteProduct} 
                    />
                ) : (
                    <RejectionSettings 
                        categories={settings.rejectionCategories || []} 
                        onAdd={addRejection} 
                        onDelete={deleteRejection} 
                        
                        // 4. අලුතින් හැදූ Props 3 මෙතැනට Pass කර ඇත
                        mainCategories={settings.mainCategories || []}
                        onAddMainCategory={addMainCategory}
                        onDeleteMainCategory={deleteMainCategory}
                    />
                )}
            </div>
        </div>
    );
};

export default FactoryAdminView;