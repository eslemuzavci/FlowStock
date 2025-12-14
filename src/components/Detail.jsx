export default function Detail({ selectedStock }) {
    if (!selectedStock) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-500 text-lg">Bir kutucuk seçiniz</p>
                    </div>
                </div>
            </div>
        );
    }

    // Doluluk oranını hesapla
    const occupancyPercentage = selectedStock.capacity > 0
        ? (selectedStock.used / selectedStock.capacity) * 100
        : 0;

    // Doluluk durumuna göre renk
    // %0-%50: Boş (Yeşil), %50-%80: Dolu (Sarı), %80-%100: Kritik (Kırmızı), %100+: Aşırı (Koyu Mor)
    const getStatusColor = (percentage) => {
        if (percentage <= 50) return 'text-green-600';
        if (percentage > 50 && percentage < 80) return 'text-yellow-600';
        if (percentage >= 80 && percentage < 100) return 'text-orange-400';
        return 'text-red-700';
    };

    return (
        <div className="flex items-center justify-center h-full p-6">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full">
                {/* Başlık */}
                <div className="border-b border-gray-200 pb-3 mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">{selectedStock.code}</h2>
                    <p className="text-base text-gray-600 mt-1">{selectedStock.name}</p>
                </div>

                {/* Doluluk Bilgisi */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-base text-gray-700 font-semibold">Doluluk Oranı</span>
                        <span className={`text-3xl font-bold ${getStatusColor(occupancyPercentage)}`}>
                            {occupancyPercentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${occupancyPercentage <= 50
                                ? 'bg-green-500'
                                : occupancyPercentage > 50 && occupancyPercentage < 80
                                    ? 'bg-yellow-500'
                                    : occupancyPercentage >= 80 && occupancyPercentage < 100
                                        ? 'bg-orange-400'
                                        : 'bg-red-700'
                                }`}
                            style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-gray-600">
                        <span>Kullanılan: {selectedStock.used}</span>
                        <span>Kapasite: {selectedStock.capacity}</span>
                    </div>
                </div>

                {/* Ürün Listesi */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Ürünler</h3>
                    {selectedStock.stocks && selectedStock.stocks.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {selectedStock.stocks.map((product, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Ürün Kodu</p>
                                            <p className="text-base font-semibold text-gray-800">{product.productCode}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Ürün Adı</p>
                                            <p className="text-base font-semibold text-gray-800">{product.productName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Miktar</p>
                                            <p className="text-base font-semibold text-gray-800">{product.quantity} adet</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Hacim</p>
                                            <p className="text-base font-semibold text-gray-800">{product.volume} m³</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-500 italic">Bu alanda ürün bulunmamaktadır</p>
                        </div>
                    )}
                </div>

                {/* Koridor Bilgisi (varsa) */}
                {selectedStock.coridor && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex gap-3 text-sm text-gray-600">
                            <div>
                                <span className="font-semibold">Koridor:</span> {selectedStock.coridor}
                            </div>
                            <div>
                                <span className="font-semibold">Sütun:</span> {selectedStock.column}
                            </div>
                            <div>
                                <span className="font-semibold">Seviye:</span> {selectedStock.level}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
