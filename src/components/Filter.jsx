import { useState, useEffect } from 'react';

export default function Filter() {
    const [allStocks, setAllStocks] = useState([]);
    const [filterType, setFilterType] = useState('capacity');
    const [capacityFilter, setCapacityFilter] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        fetch('/db.json')
            .then(res => res.json())
            .then(data => setAllStocks(data.stocks))
            .catch(err => console.error('Veri yükleme hatası:', err));
    }, []);

    // Kapasiteye göre filtreleme
    const handleCapacityFilter = () => {
        if (!capacityFilter) return;

        let results = allStocks.filter(stock => {
            if (stock.code === 'WE' || stock.code === '*') return false;

            const percentage = stock.capacity > 0 ? (stock.used / stock.capacity) * 100 : 0;

            // 0-50: boş, >50-<80: dolu, >=80-<100: kritik, >=100: aşırı
            if (capacityFilter === 'bos') return percentage <= 50;
            if (capacityFilter === 'dolu') return percentage > 50 && percentage < 80;
            if (capacityFilter === 'kritik') return percentage >= 80 && percentage < 100;
            if (capacityFilter === 'asiri') return percentage >= 100;
            return false;
        });

        // En az doluluktan en fazla doluluğa doğru sırala
        results = results.sort((a, b) => {
            const pa = a.capacity > 0 ? (a.used / a.capacity) * 100 : 0;
            const pb = b.capacity > 0 ? (b.used / b.capacity) * 100 : 0;
            return pa - pb;
        });

        setFilteredResults(results);
        setShowResults(true);
    };

    // Ürüne göre filtreleme
    const handleProductFilter = () => {
        if (!productSearch.trim()) return;

        const searchTerm = productSearch.toLowerCase().trim();
        const results = [];
        let totalQuantity = 0;
        let inProcessQuantity = 0;
        let waitingQuantity = 0;

        // WE ve * kodlarını ayrı kontrol et
        allStocks.forEach(stock => {
            stock.stocks?.forEach(product => {
                const matchesCode = product.productCode.toLowerCase().includes(searchTerm);
                const matchesName = product.productName.toLowerCase().includes(searchTerm);

                if (matchesCode || matchesName) {
                    totalQuantity += product.quantity;

                    if (stock.code === '*') {
                        inProcessQuantity += product.quantity;
                    } else if (stock.code === 'WE') {
                        waitingQuantity += product.quantity;
                    }

                    results.push({
                        ...product,
                        stockCode: stock.code,
                        stockName: stock.name,
                        stockCapacity: stock.capacity,
                        stockUsed: stock.used
                    });
                }
            });
        });

        setFilteredResults({
            products: results,
            totalQuantity,
            inProcessQuantity,
            waitingQuantity
        });
        setShowResults(true);
    };

    const handleSearch = () => {
        if (filterType === 'capacity') {
            handleCapacityFilter();
        } else {
            handleProductFilter();
        }
    };

    const getStatusBadge = (percentage) => {
        if (percentage <= 50) {
            return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Boş</span>;
        }
        if (percentage > 50 && percentage < 80) {
            return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Dolu</span>;
        }
        if (percentage >= 80 && percentage < 100) {
            return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">Kritik</span>;
        }
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">Aşırı</span>;
    };

    return (
        <div className=" rounded-lg shadow-lg p-6 mb-6">
            {/* Filtre Başlık */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Filtreleme</h2>

            {/* Filtre Tipi Seçimi */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => {
                        setFilterType('capacity');
                        setShowResults(false);
                    }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${filterType === 'capacity'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Kapasiteye Göre
                </button>
                <button
                    onClick={() => {
                        setFilterType('product');
                        setShowResults(false);
                    }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${filterType === 'product'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Ürüne Göre
                </button>
            </div>

            {/* Kapasite Filtresi */}
            {filterType === 'capacity' && (
                <div className="flex gap-4 items-center mb-6">
                    <select
                        value={capacityFilter}
                        onChange={(e) => setCapacityFilter(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Durum Seçiniz</option>
                        <option value="bos">Boş (0-50%)</option>
                        <option value="dolu">Dolu (50-80%)</option>
                        <option value="kritik">Kritik (80-100%)</option>
                        <option value="asiri">Aşırı (100%+)</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md"
                    >
                        Ara
                    </button>
                </div>
            )}

            {/* Ürün Filtresi */}
            {filterType === 'product' && (
                <div className="flex gap-4 items-center mb-6">
                    <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Ürün kodu veya adı"
                        className="flex-1 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md"
                    >
                        Ara
                    </button>
                </div>
            )}

            {/* Sonuçlar - Kapasite Filtresi */}
            {showResults && filterType === 'capacity' && (
                <div className="mt-6 overflow-x-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Sonuçlar ({filteredResults.length} depo bulundu)
                    </h3>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Depo Kodu</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Durum</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Doluluk Oranı</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Kullanılan/Kapasite</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Ürünler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((stock) => {
                                const percentage = stock.capacity > 0 ? (stock.used / stock.capacity) * 100 : 0;
                                return (
                                    <tr key={stock.code} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 font-semibold">{stock.code}</td>
                                        <td className="border border-gray-300 px-4 py-3">{getStatusBadge(percentage)}</td>
                                        <td className="border border-gray-300 px-4 py-3 font-bold text-gray-800">
                                            {percentage.toFixed(1)}%
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3">
                                            {stock.used} / {stock.capacity}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3">
                                            {stock.stocks && stock.stocks.length > 0 ? (
                                                <ul className="text-sm">
                                                    {stock.stocks.map((product, idx) => (
                                                        <li key={idx} className="mb-1">
                                                            {product.productCode} - {product.productName} ({product.quantity} adet)
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-gray-500 italic">Ürün yok</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Sonuçlar - Ürün Filtresi */}
            {showResults && filterType === 'product' && filteredResults.products && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Ürün Sonuçları
                    </h3>

                    {/* Özet Bilgiler */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Toplam Miktar</p>
                            <p className="text-3xl font-bold text-blue-700">{filteredResults.totalQuantity}</p>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">İşlemde (*)</p>
                            <p className="text-3xl font-bold text-yellow-700">{filteredResults.inProcessQuantity}</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Mal Kabul (WE)</p>
                            <p className="text-3xl font-bold text-green-700">{filteredResults.waitingQuantity}</p>
                        </div>
                    </div>

                    {/* Detaylı Tablo */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Depo Kodu</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Ürün Kodu</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Ürün Adı</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Miktar</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Hacim</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Depo Durumu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.products.map((product, idx) => {
                                    const percentage = product.stockCapacity > 0
                                        ? (product.stockUsed / product.stockCapacity) * 100
                                        : 0;
                                    return (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-3 font-semibold">{product.stockCode}</td>
                                            <td className="border border-gray-300 px-4 py-3">{product.productCode}</td>
                                            <td className="border border-gray-300 px-4 py-3">{product.productName}</td>
                                            <td className="border border-gray-300 px-4 py-3 font-bold">{product.quantity} adet</td>
                                            <td className="border border-gray-300 px-4 py-3">{product.volume} m³</td>
                                            <td className="border border-gray-300 px-4 py-3">
                                                {product.stockCode === 'WE' || product.stockCode === '*'
                                                    ? <span className="text-gray-500 italic">{product.stockName}</span>
                                                    : `${percentage.toFixed(1)}%`
                                                }
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Sonuç bulunamadı mesajı */}
            {showResults && (
                (filterType === 'capacity' && filteredResults.length === 0) ||
                (filterType === 'product' && filteredResults.products?.length === 0)
            ) && (
                    <div className="mt-6 bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-500 text-lg">Sonuç bulunamadı</p>
                    </div>
                )}
        </div>
    );
}
