import Navbar from "../components/Common/Navbar";

export default function MainLayout({ children }) {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="transition-all duration-300">
                {children}
            </div>
        </div>
    );
}
