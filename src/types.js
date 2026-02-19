// src/types.js

// 1. Factory Model
export const createFactoryData = (code, name, username, password) => ({
    id: code,             // දැන් ID එක වෙන්නේ අපි දෙන Short Code එක (Ex: FAC01)
    name: name,
    username: username,
    password: password,
    role: 'factory',
    createdAt: new Date().toISOString(),
    isActive: true
});

// 2. Production Row Model
export const createProductionRow = (shift) => ({
    id: Date.now().toString(), // Row ID එකට විතරක් timestamp ගමු
    shiftType: shift,          // 'Day' or 'Night'
    machineNo: '',
    operatorName: '',
    productName: '',
    weight: 0,
    productionQty: 0,
    rejectionQty: 0,
    rejectionDetails: [],
    status: 'draft',
    lastUpdated: new Date().toISOString()
});