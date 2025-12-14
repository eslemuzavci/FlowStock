import { useEffect, useMemo, useState } from "react";

// BU SAYFA -> DASHBOARD SAYFASININ DEPO GENEL DOLULUK KARTIDIR.

export default function WarehouseOccupancyTable() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/db.json");
                const data = await res.json();
                setStocks(data?.stocks || []);
            } catch (e) {
                setError("Veri yüklenemedi");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const stats = useMemo(() => {
        if (!stocks.length) return { used: 0, capacity: 0, percent: 0 };
        const capacity = stocks.reduce((sum, s) => sum + (s.capacity || 0), 0);
        const used = stocks.reduce((sum, s) => sum + (s.used || 0), 0);
        const percent = capacity > 0 ? Math.min(100, Math.round((used / capacity) * 100)) : 0;
        return { used, capacity, percent };
    }, [stocks]);

    const circumference = 2 * Math.PI * 52; // r=52
    const strokeDashoffset = useMemo(() => {
        const prog = Math.max(0, Math.min(100, stats.percent));
        return circumference * (1 - prog / 100);
    }, [stats.percent, circumference]);

    if (loading) {
        return <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">Yükleniyor...</div>;
    }
    if (error) {
        return <div className="bg-white rounded-xl shadow-sm p-4 border border-red-200 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Depo Genel Doluluk</h3>
            <div className="flex items-center gap-6">
                <div className="relative w-36 h-36">
                    <svg width="144" height="144" viewBox="0 0 144 144" className="rotate-[-90deg]">
                        <circle cx="72" cy="72" r="52" stroke="#E5E7EB" strokeWidth="16" fill="none" />
                        <circle
                            cx="72"
                            cy="72"
                            r="52"
                            stroke={stats.percent >= 100 ? "#EF4444" : stats.percent === 0 ? "#10B981" : "#3B82F6"}
                            strokeWidth="16"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{stats.percent}%</div>
                            <div className="text-xs text-gray-500">Doluluk</div>
                        </div>
                    </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="font-semibold text-gray-900">Açıklama</div>
                    <p className="leading-snug text-gray-600">Toplam kapasite: {stats.capacity}</p>
                    <p className="leading-snug text-gray-600">Kullanılan: {stats.used}</p>
                    <p className="leading-snug text-gray-600">Depo genel doluluk oranı {stats.percent}%.</p>
                </div>
            </div>
        </div>
    );
}
