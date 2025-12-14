import { useEffect, useMemo, useState } from "react";

// BU SAYFA -> DASHBOARD SAYFASININ RAF DURUMU KARTIDIR.

export default function ShelfTable() {
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

    const groups = useMemo(() => {
        const relevant = stocks.filter((s) => s.coridor); // raflar
        const base = {
            Bos: [],
            Yakin: [],
            Tasmis: [],
        };

        relevant.forEach((s) => {
            const capacity = s.capacity || 0;
            const used = s.used || 0;
            const percent = capacity > 0 ? Math.round((used / capacity) * 100) : 0;

            if (percent === 0) base.Bos.push(s.code);
            else if (percent >= 100) base.Tasmis.push(s.code);
            else if (percent >= 80) base.Yakin.push(s.code);
        });

        return base;
    }, [stocks]);

    if (loading) {
        return <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">Yükleniyor...</div>;
    }
    if (error) {
        return <div className="bg-white rounded-xl shadow-sm p-4 border border-red-200 text-red-600">{error}</div>;
    }

    const renderRow = (label, items, badgeClasses) => (
        <tr>
            <td className="px-3 py-2 align-top text-sm font-semibold text-gray-800 whitespace-nowrap">{label}</td>
            <td className="px-3 py-2">
                {items.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {items.map((code) => (
                            <span
                                key={code}
                                className={`flex items-center justify-center px-2 py-1 text-xs md:text-sm leading-tight font-medium rounded-md border text-center break-words ${badgeClasses}`}
                            >
                                {code}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-sm text-gray-500">Yok</span>
                )}
            </td>
            <td className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap align-top">Toplam: {items.length}</td>
        </tr>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Raf Durumu (Boş / Yakın / Taşmış)</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Durum</th>
                            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Raflar</th>
                            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Adet</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {renderRow("Boş (%0)", groups.Bos, "bg-emerald-50 text-emerald-700 border-emerald-200")}
                        {renderRow("Taşmaya Yakın (%80-99)", groups.Yakin, "bg-amber-50 text-amber-700 border-amber-200")}
                        {renderRow("Taşmış (%100+)", groups.Tasmis, "bg-red-50 text-red-700 border-red-200")}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

