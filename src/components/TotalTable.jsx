import { useEffect, useMemo, useState } from "react";


// BU SAYFA -> DASHBOARD SAYFASININ TOPLAM RAF VE ÜRÜN ADEDİ KARTIDIR.

export default function TotalTable() {
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

    const totals = useMemo(() => {
        if (!stocks.length) return { shelfCount: 0, totalQuantity: 0 };

        const shelfCount = stocks.filter((s) => s.coridor).length;
        const totalQuantity = stocks.reduce((sum, s) => {
            const items = s.stocks || [];
            const q = items.reduce((acc, p) => acc + (p.quantity || 0), 0);
            return sum + q;
        }, 0);

        return { shelfCount, totalQuantity };
    }, [stocks]);

    if (loading) {
        return <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">Yükleniyor...</div>;
    }
    if (error) {
        return <div className="bg-white rounded-xl shadow-sm p-4 border border-red-200 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Depo Genel Bilgiler</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <div className="text-sm text-gray-600">Raf Sayısı</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{totals.shelfCount}</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <div className="text-sm text-gray-600">Ürün Adedi (Toplam)</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{totals.totalQuantity}</div>
                </div>
            </div>
        </div>
    );
}
