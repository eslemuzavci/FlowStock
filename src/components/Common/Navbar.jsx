import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 1, name: 'Dashboard', path: '/' },
        { id: 2, name: 'Depo Görünümü', path: '/depo' },
        { id: 3, name: 'Ürünler', path: '/urunler' },
    ];

    return (
        <nav className="w-full bg-gray-900 py-3 px-4 md:py-4 md:px-6 shadow-lg border-b border-gray-700 select-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                {/* Sol: Marka */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center shrink-0 focus:outline-none"
                    aria-label="FlowStock Anasayfa"
                >
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-white">
                        <span className="text-indigo-400">Flow</span>Stock
                    </h1>
                </button>

                {/* Sağ: Sayfa Seçenekleri */}
                <div className="flex items-center gap-2 overflow-x-auto">
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`${active
                                    ? 'bg-indigo-600 text-white'
                                    : ' text-gray-300 hover:bg-gray-700'} px-3 md:px-4 py-2 rounded-md text-sm md:text-base transition-colors whitespace-nowrap`}
                                aria-current={active ? 'page' : undefined}
                            >
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
