import { useState, useEffect } from 'react';

export default function Grid({ onStockClick, selectedStock }) {
    const [stocks, setStocks] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        fetch('/db.json')
            .then(res => res.json())
            .then(data => {
                // WE ve * kodlarını filtrele
                const filteredStocks = data.stocks.filter(
                    stock => stock.code !== 'WE' && stock.code !== '*'
                );
                setStocks(filteredStocks);
            })
            .catch(err => console.error('Veri yükleme hatası:', err));
    }, []);

    // Stocks'ları A, B, C gruplarına ayır
    const groupedStocks = {
        A: stocks.filter(stock => stock.code.startsWith('A')),
        B: stocks.filter(stock => stock.code.startsWith('B')),
        C: stocks.filter(stock => stock.code.startsWith('C')),
    };

    const slides = ['A', 'B', 'C'];

    // Doluluk oranını hesapla
    const getOccupancyPercentage = (used, capacity) => {
        return capacity > 0 ? (used / capacity) * 100 : 0;
    };

    // Doluluk oranına göre renk belirle
    // %0-%50: Boş (Yeşil), %50-%80: Dolu (Sarı), %80-%100: Kritik (Kırmızı), %100+: Aşırı (Koyu Kırmızı/Mor)
    const getBackgroundColor = (percentage) => {
        if (percentage <= 50) {
            return 'bg-green-200';
        }
        if (percentage > 50 && percentage < 80) {
            return 'bg-yellow-200';
        }
        if (percentage >= 80 && percentage < 100) {
            return 'bg-orange-400';
        }
        // 100 ve üzeri
        return 'bg-red-700';
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const currentCoridor = slides[currentSlide];
    const currentStocks = groupedStocks[currentCoridor] || [];

    return (
        <div className="flex items-center justify-center py-8">
            <div className="relative w-full max-w-2xl">
                {/* Slider Başlık */}
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Koridor {currentCoridor}
                    </h2>
                </div>

                {/* Slider Container */}
                <div className="relative flex items-center">
                    {/* Sol Ok */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 z-10 bg-white hover:bg-gray-100 text-gray-800 font-bold p-4 rounded-full shadow-lg transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Grid 3x3 */}
                    <div className="grid grid-cols-3 gap-2 w-full mx-14">
                        {currentStocks.map((stock) => {
                            const percentage = getOccupancyPercentage(stock.used, stock.capacity);
                            const bgColor = getBackgroundColor(percentage);

                            return (
                                <div
                                    key={stock.code}
                                    onClick={() => onStockClick(stock)}
                                    className={`${bgColor} flex flex-col items-center justify-center rounded-lg p-3 shadow-md aspect-square transition-all hover:shadow-xl cursor-pointer ${selectedStock?.code === stock.code ? 'ring-4 ring-blue-500 scale-105' : ''
                                        }`}
                                >
                                    <p className="text-lg font-bold text-gray-800 mb-1">
                                        {stock.code}
                                    </p>
                                    <p className="text-2xl font-extrabold text-gray-900">
                                        {percentage.toFixed(0)}%
                                    </p>
                                    <p className="text-xs text-gray-700 mt-2">
                                        {stock.used} / {stock.capacity}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sağ Ok */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 z-10 bg-white hover:bg-gray-100 text-gray-800 font-bold p-4 rounded-full shadow-lg transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Slider Göstergesi */}
                <div className="flex justify-center mt-4 space-x-2">
                    {slides.map((slide, index) => (
                        <button
                            key={slide}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                ? 'bg-blue-600 w-8'
                                : 'bg-gray-400 hover:bg-gray-500'
                                }`}
                        />
                    ))}
                </div>

                {/* Renk Açıklama */}
                <div className="flex justify-center mt-4 space-x-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                        <span className="text-sm text-gray-800">Boş (0-50%)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                        <span className="text-sm text-gray-800">Dolu (50-80%)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                        <span className="text-sm text-gray-800">Kritik (80-100%)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-700 rounded mr-2"></div>
                        <span className="text-sm text-gray-800">Aşırı (100%+)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
