// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { 
    initializeFirestore, 
    persistentLocalCache, 
    persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDjB7bv34-RuNvWEA1p1CaM1V4MwRKwQHk",
    authDomain: "qa-app363.firebaseapp.com",
    projectId: "qa-app363",
    storageBucket: "qa-app363.firebasestorage.app",
    messagingSenderId: "217420761452",
    appId: "1:217420761452:web:44d4978cb697c2a3da4b49",
    measurementId: "G-9ZDCCTHFBM"
};

// Firebase App එක Initialize කිරීම
const app = initializeApp(firebaseConfig);

// --- New Modern Caching Logic ---
// පරණ enableIndexedDbPersistence වෙනුවට මෙය භාවිතා කරන්න.
// මෙය Multiple Tabs ප්‍රශ්නයත් විසඳයි.
const dbFirestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});

// Export කිරීම
export { dbFirestore };