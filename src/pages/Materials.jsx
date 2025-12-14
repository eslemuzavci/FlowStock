import { useState, useEffect } from 'react';

export default function Materials() {
    const [materials, setMaterials] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/db.json')
            .then(res => res.json())
            .then(data => {
                setMaterials(data.material);
                setStocks(data.stocks);
                setLoading(false);
            })
            .catch(err => {
                console.error('Veri yükleme hatası:', err);
                setLoading(false);
            });
    }, []);

    // Bir ürünün hangi raflarda bulunduğunu bul
    const findProductLocations = (productCode) => {
        const locations = [];
        stocks.forEach(stock => {
            if (stock.stocks && stock.stocks.length > 0) {
                const hasProduct = stock.stocks.some(item => item.productCode === productCode);
                if (hasProduct) {
                    locations.push(stock.code);
                }
            }
        });
        return locations;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-2xl">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray mb-2">Ürün Listesi</h1>
                <p className="text-gray-400 text-lg">Depodaki tüm ürünler ve lokasyonları</p>
            </div>

            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-purple-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Ürün Kodu</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Ürün Adı</th>
                                <th className="px-6 py-4 text-center text-lg font-semibold">Toplam Miktar</th>
                                <th className="px-6 py-4 text-center text-lg font-semibold">Hacim (m³)</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Bulunduğu Raflar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {materials.map((material, index) => {
                                const locations = findProductLocations(material.productCode);
                                return (
                                    <tr
                                        key={material.productCode}
                                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-base font-semibold text-purple-600">
                                                {material.productCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-base font-medium text-gray-800">
                                                {material.productName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-base font-semibold text-gray-700">
                                                {material.totalQuantity} adet
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-base text-gray-700">
                                                {material.volume}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {locations.length > 0 ? (
                                                    locations.map(location => (
                                                        <span
                                                            key={location}
                                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                        >
                                                            {location}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic text-sm">
                                                        Raf bulunamadı
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* İstatistikler */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-white">
                    <div className="text-lg font-semibold mb-2">Toplam Ürün Çeşidi</div>
                    <div className="text-4xl font-bold">{materials.length}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white">
                    <div className="text-lg font-semibold mb-2">Toplam Miktar</div>
                    <div className="text-4xl font-bold">
                        {materials.reduce((sum, item) => sum + item.totalQuantity, 0)} adet
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-6 text-white">
                    <div className="text-lg font-semibold mb-2">Toplam Hacim</div>
                    <div className="text-4xl font-bold">
                        {materials.reduce((sum, item) => sum + (item.volume * item.totalQuantity), 0)} m³
                    </div>
                </div>
            </div>
        </div>
    );
}
