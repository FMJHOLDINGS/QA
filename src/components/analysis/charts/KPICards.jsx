import React from 'react';
import { Package, AlertCircle, Activity } from 'lucide-react';

const KPICards = ({ data }) => {
    const fmt = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Production Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-4 hover:scale-[1.01] transition-transform">
                <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-xl text-blue-600 dark:text-blue-300"><Package size={24} /></div>
                <div>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider">Total Production</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{fmt(data.totalProd)} <span className="text-sm">kg</span></h3>
                </div>
            </div>
            {/* Rejection Card */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-800 flex items-center gap-4 hover:scale-[1.01] transition-transform">
                <div className="p-3 bg-red-100 dark:bg-red-800 rounded-xl text-red-600 dark:text-red-300"><AlertCircle size={24} /></div>
                <div>
                    <p className="text-xs font-bold text-red-600 dark:text-red-300 uppercase tracking-wider">Total Rejection</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{fmt(data.totalRej)} <span className="text-sm">kg</span></h3>
                </div>
            </div>
            {/* Rate Card */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800 flex items-center gap-4 hover:scale-[1.01] transition-transform">
                <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-xl text-orange-600 dark:text-orange-300"><Activity size={24} /></div>
                <div>
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-300 uppercase tracking-wider">Rejection Rate</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.rate}%</h3>
                </div>
            </div>
        </div>
    );
};
export default KPICards;