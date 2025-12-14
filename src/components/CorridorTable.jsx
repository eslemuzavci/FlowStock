import { useEffect, useMemo, useState } from "react";

// BU SAYFA -> DASHBOARD SAYFASININ KORİDOR BAZLI DOLULUK KARTIDIR.

export default function CorridorTable() {
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

    const corridorStats = useMemo(() => {
        const grouped = { A: { used: 0, capacity: 0 }, B: { used: 0, capacity: 0 }, C: { used: 0, capacity: 0 } };
        stocks.forEach((s) => {
            if (!s.coridor || !grouped[s.coridor]) return;
            grouped[s.coridor].used += s.used || 0;
            grouped[s.coridor].capacity += s.capacity || 0;
        });
        return ["A", "B", "C"].map((c) => {
            const cap = grouped[c].capacity;
            const used = grouped[c].used;
            const percent = cap > 0 ? Math.min(100, Math.round((used / cap) * 100)) : 0;
            return { corridor: c, used, capacity: cap, percent };
        });
    }, [stocks]);

    const barColor = (p) => {
        if (p >= 100) return "bg-red-500";
        if (p >= 30 && p <= 70) return "bg-amber-400";
        if (p === 0) return "bg-emerald-500";
        return "bg-blue-500";
    };

    if (loading) {
        return <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">Yükleniyor...</div>;
    }
    if (error) {
        return <div className="bg-white rounded-xl shadow-sm p-4 border border-red-200 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Koridor Bazlı Doluluk</h3>
            <div className="flex items-end justify-between gap-6" style={{ minHeight: "200px" }}>
                {corridorStats.map((c) => (
                    <div key={c.corridor} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-sm font-semibold text-gray-800">%{c.percent}</div>
                        <div className="w-10 bg-gray-100 rounded-lg h-40 flex items-end overflow-hidden">
                            <div
                                className={`${barColor(c.percent)} w-full transition-all duration-500`}
                                style={{ height: `${c.percent}%`, minHeight: c.percent > 0 ? "6px" : "0px" }}
                                title={`%${c.percent} (${c.used}/${c.capacity})`}
                            />
                        </div>
                        <div className="text-sm font-semibold text-gray-800">{c.corridor} Koridoru</div>
                        <div className="text-xs text-gray-600">{c.used}/{c.capacity}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

