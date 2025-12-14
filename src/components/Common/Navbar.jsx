import React from "react";

const Navbar = () => {
    return (
        <nav className="w-full bg-gray-900 py-4 px-6 shadow-lg border-b border-gray-700">
            <div className="flex items-center space-y-0 flex-col text-center select-none">
                {/* Marka İsmi */}
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider text-white">
                    <span className="text-indigo-400">Flow</span>Stock
                </h1>

                {/* Alt Başlık */}
                <p className="text-sm md:text-base text-gray-300 mt-1">
                    Depo Stok Takip Uygulaması
                </p>
            </div>
        </nav>
    );
};

export default Navbar;
