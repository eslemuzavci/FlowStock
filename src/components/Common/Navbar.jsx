import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const wrapRef = useRef(null);
    const brandRef = useRef(null);
    const measureRef = useRef(null);
    const dropdownRef = useRef(null);
    const burgerRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [isSmall, setIsSmall] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : true));
    const [measureWidth, setMeasureWidth] = useState(0);
    const [overflow, setOverflow] = useState(false);

    const menuItems = [
        { id: 1, name: 'Dashboard', path: '/' },
        { id: 2, name: 'Depo Görünümü', path: '/depo' },
        { id: 3, name: 'Ürünler', path: '/urunler' },
    ];

    const useHamburger = isSmall || overflow;

    useEffect(() => {
        const compute = () => {
            if (!wrapRef.current || !brandRef.current) return;
            const wrapW = wrapRef.current.clientWidth;
            const brandW = brandRef.current.clientWidth;
            const gap = 24; // approx spacing between brand and menu
            const available = Math.max(0, wrapW - brandW - gap);
            setMeasureWidth(available);

            if (measureRef.current) {
                // allow layout to apply width before measuring scrollWidth
                requestAnimationFrame(() => {
                    if (!measureRef.current) return;
                    const el = measureRef.current;
                    const isOverflowing = el.scrollWidth > el.clientWidth;
                    setOverflow(isOverflowing);
                });
            }
        };

        const onResize = () => {
            setIsSmall(window.innerWidth < 768);
            compute();
        };

        compute();
        window.addEventListener('resize', onResize);

        let ro;
        if (wrapRef.current && 'ResizeObserver' in window) {
            ro = new ResizeObserver(compute);
            ro.observe(wrapRef.current);
        }
        return () => {
            window.removeEventListener('resize', onResize);
            if (ro) ro.disconnect();
        };
    }, []);

    useEffect(() => {
        const onDocClick = (e) => {
            const target = e.target;
            if (
                menuOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                burgerRef.current &&
                !burgerRef.current.contains(target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [menuOpen]);

    return (
        <nav className="w-full bg-gray-900 py-3 px-4 md:py-4 md:px-6 shadow-lg border-b border-gray-700 select-none">
            <div ref={wrapRef} className="max-w-7xl mx-auto flex items-center justify-between gap-3 relative">
                {/* Sol: Marka */}
                <button
                    ref={brandRef}
                    onClick={() => navigate('/')}
                    className="flex items-center shrink-0 focus:outline-none"
                    aria-label="FlowStock Anasayfa"
                >
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-white">
                        <span className="text-indigo-400">Flow</span>Stock
                    </h1>
                </button>

                {/* Sağ: Menü */}
                {!useHamburger && (
                    <div className="flex items-center gap-2">
                        {menuItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`${active
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} px-3 md:px-4 py-2 rounded-md text-sm md:text-base transition-colors whitespace-nowrap`}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                )}

                {useHamburger && (
                    <button
                        ref={burgerRef}
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Menüyü aç/kapat"
                        aria-expanded={menuOpen}
                        className="p-2 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                )}

                {/* Gizli ölçüm konteyneri: Taşma kontrolü için */}
                <div className="absolute invisible pointer-events-none top-0 left-0">
                    <div
                        ref={measureRef}
                        style={{ width: measureWidth }}
                        className="flex items-center gap-2"
                    >
                        {menuItems.map((item) => (
                            <span key={`measure-${item.id}`} className="px-3 py-2 rounded-md text-sm md:text-base whitespace-nowrap bg-gray-800">
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Dropdown */}
                {useHamburger && menuOpen && (
                    <div ref={dropdownRef} className="absolute right-4 top-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg p-2 z-50 min-w-[180px]">
                        {menuItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <button
                                    key={`dd-${item.id}`}
                                    onClick={() => { setMenuOpen(false); navigate(item.path); }}
                                    className={`${active ? 'bg-indigo-600 text-white' : 'text-gray-200 hover:bg-gray-700'} w-full text-left px-3 py-2 rounded-md transition-colors`}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </nav>
    );
};


export default Navbar;
