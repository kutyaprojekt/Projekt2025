import React, { useEffect, useState } from 'react';
import { useTheme } from "../../../context/ThemeContext";
import UserPostsTemplate from './UserPostsTemplate';
import { Link } from "react-router-dom";
import { FaPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // Hiányzó ikonok hozzáadva
const UserPosts = () => {
    const [animals, setAnimals] = useState([]);
    const { theme } = useTheme();
    const token = localStorage.getItem("usertoken");

    const loadAnimals = async () => {
        try {
            const response = await fetch("http://localhost:8000/felhasznalok/posztjaim", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setAnimals(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Hiba történt az API hívás során:", error);
            setAnimals([]);
        }
    };

    useEffect(() => {
        loadAnimals();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-[#F0F4F8]"}`}>
            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-8">
                {/* Oldalsó menü - teljesen megegyezik a Profil oldal designjával */}
                <div className={`w-full md:w-72 lg:w-80 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6 md:sticky md:top-24 md:h-fit`}>
                    <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Fiókbeállítások</h2>
                    <nav className="space-y-3">
                        <Link
                            to="/profilom"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                theme === 'dark' 
                                    ? 'hover:bg-gray-700' 
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <FaUser className="mr-3 text-lg" />
                            <span className="font-medium">Profilom</span>
                        </Link>
                        
                        <Link
                            to="/posztjaim"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-white' 
                                    : 'bg-[#1A73E8] text-white'
                            }`}
                        >
                            <FaEnvelope className="mr-3 text-lg" />
                            <span className="font-medium">Posztjaim</span>
                        </Link>

                        <Link
                            to="/uzenetek"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                theme === 'dark' 
                                    ? 'hover:bg-gray-700' 
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <FaLock className="mr-3 text-lg" />
                            <span className="font-medium">Üzenetek</span>
                        </Link>
                    </nav>
                </div>

                {/* Fő tartalom */}
                <div className={`flex-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-8`}>
                    <div className="flex items-center justify-between mb-10">
                        <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>
                            Posztjaim
                        </h1>
                        <Link 
                            to="/elveszettallat" 
                            className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition-colors ${
                                theme === 'dark' 
                                    ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white' 
                                    : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                            }`}
                        >
                            <FaPlus className="mr-2" />
                            Új poszt
                        </Link>
                    </div>

                    {animals.length === 0 ? (
                        <div className={`text-center py-16 ${theme === "dark" ? "text-gray-300" : "text-[#073F48]"}`}>
                            <p className="text-xl mb-6">Még nincsenek posztjaid.</p>
                            <Link 
                                to="/elveszettallat" 
                                className={`inline-block px-8 py-3 rounded-lg font-medium text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors`}
                            >
                                Új poszt létrehozása
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {animals.map((animal) => (
                                <div key={animal.id} className="h-full">
                                    <UserPostsTemplate animal={animal} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPosts;