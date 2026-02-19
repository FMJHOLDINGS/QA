import { dbFirestore } from './firebaseConfig';
import { 
    collection, doc, getDoc, setDoc, getDocs, 
    query, where 
} from 'firebase/firestore';

export const db = {
    // =================================================
    // 1. FACTORY MANAGEMENT
    // =================================================

    getAllFactories: async () => {
        const snapshot = await getDocs(collection(dbFirestore, "factories"));
        return snapshot.docs.map(doc => doc.data());
    },

    registerFactory: async (factoryData) => {
        const { id, username } = factoryData;
        const docRef = doc(dbFirestore, "factories", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            throw new Error(`Factory Code '${id}' is already registered!`);
        }
        const q = query(collection(dbFirestore, "factories"), where("username", "==", username));
        const userSnap = await getDocs(q);
        if (!userSnap.empty) {
            throw new Error(`Username '${username}' is already taken!`);
        }
        await setDoc(docRef, factoryData);
        return factoryData;
    },

    loginUser: async (type, identifier, password, selectedFactoryId = null) => {
        if (type === 'admin') {
            if (identifier === 'admin' && password === '1234') {
                return { role: 'admin', username: 'Super Admin', id: 'admin' };
            }
            throw new Error("Invalid admin credentials");
        }
        if (type === 'factory') {
            if (!selectedFactoryId) throw new Error("Please select a factory");
            const docRef = doc(dbFirestore, "factories", selectedFactoryId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) throw new Error("Factory not found");
            const data = docSnap.data();
            if (data.username === identifier && data.password === password) {
                return data;
            }
            throw new Error("Invalid credentials");
        }
        throw new Error("Invalid login type");
    },

    // =================================================
    // 2. DAILY LOGS
    // =================================================

    getDailyProduction: async (factoryId, date) => {
        const collectionName = `factory_data_${factoryId}`;
        const docRef = doc(dbFirestore, collectionName, date);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().entries || [];
        }
        return [];
    },

    syncDailyLog: async (factoryId, date, newEntries) => {
        if (!factoryId) throw new Error("Factory ID missing");
        const collectionName = `factory_data_${factoryId}`;
        const docRef = doc(dbFirestore, collectionName, date);
        const payload = {
            date: date,
            entries: newEntries,
            lastModified: new Date().toISOString()
        };
        await setDoc(docRef, payload, { merge: true });
        return true;
    },

    // DATE RANGE LOGS (New Function Included Correctly)
    getLogsByDateRange: async (factoryId, startDate, endDate) => {
        const collectionName = `factory_data_${factoryId}`;
        const q = query(
            collection(dbFirestore, collectionName),
            where("date", ">=", startDate),
            where("date", "<=", endDate)
        );
        const snapshot = await getDocs(q);
        let allEntries = [];
        snapshot.forEach(doc => {
            if (doc.id === 'settings') return; // Skip settings
            const data = doc.data();
            if (data.entries && Array.isArray(data.entries)) {
                const entriesWithDate = data.entries.map(e => ({
                    ...e,
                    logDate: data.date
                }));
                allEntries = [...allEntries, ...entriesWithDate];
            }
        });
        return allEntries;
    },

    getAllProductionLogs: async (factoryId) => {
        const collectionName = `factory_data_${factoryId}`;
        const snapshot = await getDocs(collection(dbFirestore, collectionName));
        let allEntries = [];
        snapshot.forEach(doc => {
            if (doc.id === 'settings') return;
            const data = doc.data();
            if (data.entries && Array.isArray(data.entries)) {
                const entriesWithDate = data.entries.map(e => ({
                    ...e,
                    logDate: data.date
                }));
                allEntries = [...allEntries, ...entriesWithDate];
            }
        });
        return allEntries;
    },

    // =================================================
    // 3. FACTORY SETTINGS
    // =================================================

    // =================================================
    // 3. FACTORY SETTINGS
    // =================================================

    getFactorySettings: async (factoryId) => {
        const docRef = doc(dbFirestore, "factory_settings", factoryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // කලින් save කරපු data වල mainCategories නැත්නම් empty array එකක් යවන්න
            return {
                ...data,
                mainCategories: data.mainCategories || [] 
            };
        }
        // අලුතින් mainCategories: [] එකතු කලා
        return { products: [], rejectionCategories: [], mainCategories: [] }; 
    },

    saveFactorySettings: async (factoryId, settingsData) => {
        const docRef = doc(dbFirestore, "factory_settings", factoryId);
        await setDoc(docRef, settingsData, { merge: true });
        return true;
    },

    saveFactorySettings: async (factoryId, settingsData) => {
        const docRef = doc(dbFirestore, "factory_settings", factoryId);
        await setDoc(docRef, settingsData, { merge: true });
        return true;
    }
};