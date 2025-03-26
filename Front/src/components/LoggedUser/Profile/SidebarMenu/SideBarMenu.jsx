import React from 'react';
import { 
  FaUser,         // Profilom
  FaNewspaper,    // Posztjaim
  FaEnvelope,     // Üzenetek
  FaClipboardList, // Bejegyzések (admin)
  FaUsers         // Felhasználók (admin)
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from "../../../../context/ThemeContext";

const SideBarMenu = ({ isAdmin = false }) => {
    const { theme } = useTheme();
    const location = useLocation();

    // Determine active tab based on current route
    const activeTab = () => {
        const path = location.pathname;
        if (path.includes('/profilom')) return 'profilom';
        if (path.includes('/posztjaim')) return 'posztjaim';
        if (path.includes('/uzenetek')) return 'uzenetek';
        if (path.includes('/admin/bejegyzesek')) return 'bejegyzesek';
        if (path.includes('/admin/felhasznalok')) return 'felhasznalok';
        return '';
    };

    const currentTab = activeTab();

    return (
        <div className={`w-full md:w-72 lg:w-80 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 md:sticky md:top-24 md:h-fit`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>Fiókbeállítások</h2>
            
            <nav className="space-y-3">
                {/* Profilom */}
                <Link
                    to="/profilom"
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        currentTab === 'profilom'
                            ? theme === 'dark' 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-[#1A73E8] text-white'
                            : theme === 'dark' 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-100'
                    }`}
                >
                    <FaUser className="mr-3 text-lg" />
                    <span className="font-medium">Profilom</span>
                </Link>
                
                {/* Posztjaim */}
                <Link
                    to="/posztjaim"
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        currentTab === 'posztjaim'
                            ? theme === 'dark' 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-[#1A73E8] text-white'
                            : theme === 'dark' 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-100'
                    }`}
                >
                    <FaNewspaper className="mr-3 text-lg" />
                    <span className="font-medium">Posztjaim</span>
                </Link>

                {/* Üzenetek */}
                <Link
                    to="/uzenetek"
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        currentTab === 'uzenetek'
                            ? theme === 'dark' 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-[#1A73E8] text-white'
                            : theme === 'dark' 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-100'
                    }`}
                >
                    <FaEnvelope className="mr-3 text-lg" />
                    <span className="font-medium">Üzenetek</span>
                </Link>
            </nav>

            {isAdmin && (
                <>
                    <h2 className={`text-xl font-bold my-6 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>Admin Panel</h2>
                    <nav className="space-y-3">
                        {/* Bejegyzések */}
                        <Link
                            to="/admin/bejegyzesek"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                currentTab === 'bejegyzesek'
                                    ? theme === 'dark' 
                                        ? 'bg-gray-700 text-white' 
                                        : 'bg-[#1A73E8] text-white'
                                    : theme === 'dark' 
                                        ? 'hover:bg-gray-700' 
                                        : 'hover:bg-gray-100'
                            }`}
                        >
                            <FaClipboardList className="mr-3 text-lg" />
                            <span className="font-medium">Bejegyzések</span>
                        </Link>
                        
                        {/* Felhasználók */}
                        <Link
                            to="/admin/felhasználok"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                currentTab === 'felhasználok'
                                    ? theme === 'dark' 
                                        ? 'bg-gray-700 text-white' 
                                        : 'bg-[#1A73E8] text-white'
                                    : theme === 'dark' 
                                        ? 'hover:bg-gray-700' 
                                        : 'hover:bg-gray-100'
                            }`}
                        >
                            <FaUsers className="mr-3 text-lg" />
                            <span className="font-medium">Felhasználók</span>
                        </Link>
                    </nav>
                </>
            )}
        </div>
    );
};

export default SideBarMenu;