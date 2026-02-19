import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('qa_app_session');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('qa_app_session');
            }
        }
        setLoading(false);
    }, []);

    const login = async (type, username, password, selectedFactoryId) => {
        try {
            // FIXED: db.login -> db.loginUser
            const userData = await db.loginUser(type, username, password, selectedFactoryId);
            setUser(userData);
            localStorage.setItem('qa_app_session', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('qa_app_session');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);