import { useNavigate, useLocation } from 'react-router-dom';

export default function Menu({ isOpen, setIsOpen }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            id: 1,
            name: 'Dashboard',
            path: '/',
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
            </svg>
        },
        {
            id: 2,
            name: 'Depo Görünümü',
            path: '/depo',
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
        },
        {
            id: 3,
            name: 'Ürünler',
            path: '/urunler',
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        },
    ];

    return (
        <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-900 h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col border-r border-gray-700 z-50`}>
            {/* Menü Başlık */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                {isOpen && (
                    <h2 className="text-white text-xl font-bold tracking-wider">
                        <span className="text-indigo-400">Flow</span>Stock
                    </h2>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Menü Öğeleri */}
            <nav className="flex-1 py-6 px-3">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-all group ${location.pathname === item.path
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <span className={`transition-colors ${location.pathname === item.path
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-indigo-400'
                            }`}>
                            {item.icon}
                        </span>
                        {isOpen && (
                            <span className="text-base font-medium">{item.name}</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="py-4 px-3 text-center text-sm text-gray-500">
                Eslem Uzavcı
            </div>
        </div>
    );
}
