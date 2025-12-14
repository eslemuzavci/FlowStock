import { useState } from 'react';
import Navbar from "../components/Common/Navbar";
import Menu from '../components/Common/Menu';

export default function MainLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    return (
        <div className={`bg-gray-100 min-h-screen ${isMenuOpen ? 'pl-64' : 'pl-20'} transition-all duration-300`}>
            <Navbar />
            <Menu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

            {/* İçerik alanı - Menü genişliğine göre padding ile hizalama */}
            <div className="transition-all duration-300">
                {children}
            </div>
        </div>
    );
}
