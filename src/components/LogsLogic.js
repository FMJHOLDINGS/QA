import { useState, useEffect, useMemo } from 'react';
import { db } from '../services/db';
import { useAuth } from '../context/AuthContext';

export const useLogsLogic = () => {
    const { user } = useAuth();
    
    // --- State ---
    const [loading, setLoading] = useState(true);
    const [allLogs, setAllLogs] = useState([]); // Raw data
    const [settings, setSettings] = useState({ rejectionCategories: [] });
    
    // Filters
    const [dateRange, setDateRange] = useState(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        return { start: firstDay, end: lastDay };
    });

    const [activeTab, setActiveTab] = useState('IM'); 
    const [searchTerm, setSearchTerm] = useState('');
    
    // Multi-Select States
    const [selectedMachines, setSelectedMachines] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // --- Load Data ---
    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const settingsData = await db.getFactorySettings(user.id);
                setSettings(settingsData || { rejectionCategories: [] });

                const logsData = await db.getLogsByDateRange(user.id, dateRange.start, dateRange.end);
                setAllLogs(logsData);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, dateRange]);

    // --- Filter Options (Dropdowns) ---
    const filterOptions = useMemo(() => {
        const tabFiltered = allLogs.filter(log => {
            const machine = (log.machineNo || '').toUpperCase();
            return activeTab === 'IM' ? machine.startsWith('IM') : machine.startsWith('BM');
        });

        const uniqueMachines = [...new Set(tabFiltered.map(l => l.machineNo))].sort();

        let relevantLogsForProducts = tabFiltered;
        if (selectedMachines.length > 0) {
            relevantLogsForProducts = tabFiltered.filter(l => selectedMachines.includes(l.machineNo));
        }
        const uniqueProducts = [...new Set(relevantLogsForProducts.map(l => l.productName))].sort();

        return { uniqueMachines, uniqueProducts, tabFiltered };
    }, [allLogs, activeTab, selectedMachines]);

    // --- Processed Data (Grouped by Date) ---
    const processedData = useMemo(() => {
        let filtered = filterOptions.tabFiltered;

        // Apply Machine Filter
        if (selectedMachines.length > 0) {
            filtered = filtered.filter(l => selectedMachines.includes(l.machineNo));
        }

        // Apply Product Filter
        if (selectedProducts.length > 0) {
            filtered = filtered.filter(l => selectedProducts.includes(l.productName));
        }

        // Apply Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(log => 
                (log.productName || '').toLowerCase().includes(term) ||
                (log.machineNo || '').toLowerCase().includes(term) ||
                (log.operatorName || '').toLowerCase().includes(term)
            );
        }

        // Sort Records
        filtered.sort((a, b) => {
            if (a.shiftType !== b.shiftType) return a.shiftType === 'Day' ? -1 : 1;
            return a.machineNo.localeCompare(b.machineNo);
        });

        // **GROUP BY DATE**
        const grouped = {};
        filtered.forEach(log => {
            if (!grouped[log.logDate]) grouped[log.logDate] = [];
            grouped[log.logDate].push(log);
        });

        // Convert to array of objects for easier rendering
        return Object.entries(grouped)
            .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort Groups by Date Descending
            .map(([date, logs]) => ({ date, logs }));

    }, [filterOptions.tabFiltered, selectedMachines, selectedProducts, searchTerm]);

    // --- Helpers ---
    const calculateRejRate = (prod, rej) => {
        const total = Number(prod || 0) + Number(rej || 0);
        if (total === 0) return 0;
        return ((Number(rej || 0) / total) * 100).toFixed(1);
    };

    const getRejQtyByCategory = (log, catName) => {
        if (!log.rejectionDetails) return 0;
        const detail = log.rejectionDetails.find(d => d.category === catName);
        return detail ? detail.qty : 0;
    };

    return {
        loading,
        processedData, // Returns [{date: '...', logs: [...]}, ...]
        settings,
        dateRange, setDateRange,
        activeTab, setActiveTab,
        searchTerm, setSearchTerm,
        selectedMachines, setSelectedMachines,
        selectedProducts, setSelectedProducts,
        uniqueMachines: filterOptions.uniqueMachines,
        uniqueProducts: filterOptions.uniqueProducts,
        calculateRejRate,
        getRejQtyByCategory
    };
};