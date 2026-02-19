import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';

export const useAnalysisChartsLogic = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [rawData, setRawData] = useState([]);
    // 1. settings state එකට mainCategories එකතු කලා
    const [settings, setSettings] = useState({ rejectionCategories: [], mainCategories: [] });
    const [activeView, setActiveView] = useState('current');

    // 1. DATA FETCHING
    useEffect(() => {
        if (!user?.id) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [logsData, settingsData] = await Promise.all([
                    db.getAllProductionLogs(user.id),
                    db.getFactorySettings(user.id)
                ]);
                setRawData(logsData || []);
                // 2. settingsData set කරන තැන update කලා
                setSettings({
                    rejectionCategories: settingsData?.rejectionCategories || [],
                    mainCategories: settingsData?.mainCategories || []
                });
            } catch (error) {
                console.error("Failed to load analysis data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // 2. DATA PROCESSING
    const currentMonthData = useMemo(() => {
        if (!rawData || rawData.length === 0) return null;

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const fullMonthData = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = new Date(year, month, i).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            fullMonthData.push({
                day: i,
                dateLabel: dateStr,
                fullDate: new Date(year, month, i).toDateString(),
                Production: 0,
                Rejection: 0
            });
        }

        const catMap = {};      
        const mainCatMap = {};  
        const itemMap = {};     
        let totalRej = 0;
        let totalProd = 0;

        const definedCategories = settings?.rejectionCategories || [];
        const definedMainCategories = settings?.mainCategories || []; // 3. Main categories ගත්තා

        rawData.forEach(log => {
            const logDateObj = new Date(log.logDate);
            if (logDateObj.getMonth() !== month || logDateObj.getFullYear() !== year) return;

            const logDateStr = logDateObj.toDateString();
            const weight = Number(log.weight || 0);
            
            const prodKg = (Number(log.productionQty || 0) * weight) / 1000;
            const rejKg = (Number(log.rejectionQty || 0) * weight) / 1000;

            // Update Daily Data
            const dayEntry = fullMonthData.find(d => d.fullDate === logDateStr);
            if (dayEntry) {
                dayEntry.Production += prodKg;
                dayEntry.Rejection += rejKg;
            }

            totalProd += prodKg;
            totalRej += rejKg;

            // Top Products
            if (!itemMap[log.productName]) itemMap[log.productName] = 0;
            itemMap[log.productName] += rejKg;

            // Rejection Details
            if (log.rejectionDetails) {
                log.rejectionDetails.forEach(d => {
                    const dKg = (Number(d.qty || 0) * weight) / 1000;
                    
                    // Specific Category
                    if (!catMap[d.category]) catMap[d.category] = { name: d.category, value: 0 };
                    catMap[d.category].value += dKg;

                    // 4. අලුත් Main Category Logic එක
                    // මුලින්ම sub category එකේ විස්තර හොයාගන්නවා
                    const subCatConfig = definedCategories.find(c => c.name === d.category);
                    
                    let mainTypeName = 'OTHERS'; // Default අගය
                    
                    if (subCatConfig && subCatConfig.type) {
                        // ඊට පස්සේ ඒක අයිති main category එක හොයාගන්නවා
                        const mainCatConfig = definedMainCategories.find(mc => mc.id === subCatConfig.type);
                        if (mainCatConfig && mainCatConfig.label) {
                            mainTypeName = mainCatConfig.label.toUpperCase();
                        } else {
                            // පරණ විදිහට type එක කෙලින්ම සේව් වෙලා තිබුණොත් (e.g. "OPERATOR ISSUES")
                            mainTypeName = subCatConfig.type.toUpperCase();
                        }
                    }

                    if (!mainCatMap[mainTypeName]) mainCatMap[mainTypeName] = 0;
                    mainCatMap[mainTypeName] += dKg;
                });
            }
        });

        // Final Sort & Format
        const dailyData = fullMonthData.map(d => ({
            ...d,
            Production: Number(d.Production.toFixed(1)),
            Rejection: Number(d.Rejection.toFixed(1))
        }));

        const pieData = Object.values(catMap)
            .sort((a,b) => b.value - a.value)
            .map(d => ({ ...d, value: Number(d.value.toFixed(1)) }));

        const mainPieData = Object.entries(mainCatMap)
            .map(([name, value]) => ({ name, value: Number(value.toFixed(1)) }))
            .sort((a,b) => b.value - a.value);

        const topItems = Object.entries(itemMap)
            .map(([name, value]) => ({ name, value: Number(value.toFixed(1)) }))
            .sort((a,b) => b.value - a.value)
            .slice(0, 5); 

        return { 
            dailyData, pieData, mainPieData, topItems, 
            totalRej: Number(totalRej.toFixed(1)),
            totalProd: Number(totalProd.toFixed(1)),
            rate: totalProd > 0 ? ((totalRej / totalProd) * 100).toFixed(2) : 0
        };

    }, [rawData, settings]);

    return { loading, activeView, setActiveView, currentMonthData, rawData };
};