import { useEffect, useMemo, useState } from "react";


// BU SAYFA -> DASHBOARD SAYFASININ İŞLEM ALANI (*) KARTIDIR.

export default function ProcessingTable() {
    const [proc, setProc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/db.json");
                const data = await res.json();
                const pStock = (data?.stocks || []).find((s) => s.code === "*");
                setProc(pStock || null);
            } catch (e) {
                setError("Veri yüklenemedi");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const stats = useMemo(() => {
        if (!proc) return { used: 0, capacity: 0, percent: 0, clamped: 0 };
        const used = proc.used || 0;
        const capacity = proc.capacity || 0;
        const rawPercent = capacity > 0 ? Math.round((used / capacity) * 100) : 0;
        const clamped = Math.max(0, Math.min(100, rawPercent));
        return { used, capacity, percent: rawPercent, clamped };
    }, [proc]);

    const circumference = 2 * Math.PI * 48; // r=48
    const strokeDashoffset = useMemo(() => {
        return circumference * (1 - stats.clamped / 100);
    }, [stats.clamped, circumference]);

    const strokeColor = useMemo(() => {
        if (stats.percent <= 50) return "#10B981"; // green
        if (stats.percent > 50 && stats.percent < 80) return "#F59E0B"; // yellow
        if (stats.percent >= 80 && stats.percent < 100) return "#F97316"; // orange
        return "#B91C1C"; // dark red for 100%+
    }, [stats.percent]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">Yükleniyor...</div>
        );
    }
    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-red-200 text-red-600">{error}</div>
        );
    }
    if (!proc) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">İşlem verisi bulunamadı</div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">İşlem Alanı (*)</h3>
                    <p className="text-sm text-gray-600">Capacity: {stats.capacity} • Used: {stats.used} • Doluluk: {stats.percent}%</p>
                </div>
                <div className="relative w-32 h-32">
                    <svg width="128" height="128" viewBox="0 0 128 128" className="rotate-[-90deg]">
                        <circle cx="64" cy="64" r="48" stroke="#E5E7EB" strokeWidth="14" fill="none" />
                        <circle
                            cx="64"
                            cy="64"
                            r="48"
                            stroke={strokeColor}
                            strokeWidth="14"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-base font-semibold text-gray-800">{stats.percent}%</span>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-medium text-gray-700">Ürünler (İşlemde)</h4>
                    <span className="text-sm text-gray-500">Toplam ürün: {proc.stocks?.length || 0}</span>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Kod</th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Ürün</th>
                                <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Adet</th>
                                <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Hacim</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {(proc.stocks || []).map((p) => (
                                <tr key={`${p.productCode}-${p.productName}`} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 text-sm text-gray-800">{p.productCode}</td>
                                    <td className="px-3 py-2 text-sm text-gray-800">{p.productName}</td>
                                    <td className="px-3 py-2 text-sm text-gray-900 text-right font-medium">{p.quantity}</td>
                                    <td className="px-3 py-2 text-sm text-gray-900 text-right">{p.volume}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
