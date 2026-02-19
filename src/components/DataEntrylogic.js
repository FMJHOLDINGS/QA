import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/db'; 
import { useAuth } from '../context/AuthContext';
import { createProductionRow } from '../types';

export const useDataEntry = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [allEntries, setAllEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Admin Settings තියාගන්න අලුත් State එකක්
    const [settings, setSettings] = useState({ products: [], rejectionCategories: [] });

    // 1. Data Load කිරීම (Logs + Settings)
    useEffect(() => {
        if (!user?.id) return;
        const load = async () => {
            setLoading(true);
            try {
                // දත්ත සහ Settings දෙකම එකපාර load කරමු
                const [dailyData, settingsData] = await Promise.all([
                    db.getDailyProduction(user.id, selectedDate),
                    db.getFactorySettings(user.id)
                ]);

                setAllEntries(dailyData);
                setSettings(settingsData || { products: [], rejectionCategories: [] });

            } catch (e) {
                console.error("Load failed", e);
            }
            setLoading(false);
        };
        load();
    }, [user, selectedDate]);

    // 2. Add Row
    const addRow = (shift) => {
        const newRow = createProductionRow(shift);
        setAllEntries(prev => [...prev, newRow]);
    };

    // 3. Update Row
    const updateRow = useCallback((id, field, value) => {
        setAllEntries(prev => prev.map(r => r.id === id ? { ...r, [field]: value, status: 'draft' } : r));
    }, []);

    // 4. Remove Row
    const removeRow = async (id) => {
        const updatedList = allEntries.filter(r => r.id !== id);
        setAllEntries(updatedList);
        await db.syncDailyLog(user.id, selectedDate, updatedList);
    };

    // 5. Auto Save
    useEffect(() => {
        if (!user?.id) return;

        const timer = setTimeout(async () => {
            // FIX: && r.productionQty යන්න ඉවත් කරන ලදී. 
            // දැන් Rejection පමනක් add කලත් Save වේ.
            const hasDrafts = allEntries.some(r => r.status === 'draft'); 
            
            if (hasDrafts) {
                const cleanRows = allEntries.map(r => 
                    r.status === 'draft' ? { ...r, status: 'saved' } : r
                );
                
                await db.syncDailyLog(user.id, selectedDate, cleanRows);
                setAllEntries(cleanRows);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [allEntries, user, selectedDate]);

    return {
        selectedDate, setSelectedDate,
        dayRows: allEntries.filter(r => r.shiftType === 'Day'),
        nightRows: allEntries.filter(r => r.shiftType === 'Night'),
        addRow, updateRow, removeRow, loading,
        settings // Settings ටික UI එකට යවනවා
    };
};