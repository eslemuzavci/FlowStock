import { useState, useRef } from 'react';
import Grid from '../components/Grid';
import Detail from '../components/Detail';
import Filter from '../components/Filter';

export default function GridDetail() {
    const [selectedStock, setSelectedStock] = useState(null);
    const detailRef = useRef(null);

    const handleStockClick = (stock) => {
        setSelectedStock(stock);
        // Detay paneline yumuşak kaydırma
        if (detailRef.current) {
            detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Filtre Bölümü - En Üstte */}
            <div className="w-full px-8 pt-8">
                <Filter />
            </div>

            {/* Grid ve Detay Bölümü */}
            <div className="flex flex-col lg:flex-row w-full">
                {/* Sol Taraf - Grid (Mobilde Üstte) */}
                <div className="w-full lg:w-1/2">
                    <Grid onStockClick={handleStockClick} selectedStock={selectedStock} />
                </div>

                {/* Sağ Taraf - Detay (Mobilde Altta) */}
                <div ref={detailRef} className="w-full lg:w-1/2 ">
                    <Detail selectedStock={selectedStock} />
                </div>
            </div>
        </div>
    );
}
