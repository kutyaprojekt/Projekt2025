import React, { useEffect, useState } from 'react';
import { useTheme } from "../../../context/ThemeContext";
import UserPostsTemplate from './UserPostsTemplate';
import SideBarMenu from './SidebarMenu/SideBarMenu';
import { Link } from "react-router-dom";
import { FaPlus } from 'react-icons/fa';

const UserPosts = () => {
    const [animals, setAnimals] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const { theme } = useTheme();
    const token = localStorage.getItem("usertoken");
    const [activeTab, setActiveTab] = useState('posztjaim');

    const loadUserData = async () => {
        try {
            // Felhasználó adatainak lekérése
            const userResponse = await fetch("http://localhost:8000/felhasznalok/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const userData = await userResponse.json();
            setUser(userData);

            // Admin státusz ellenőrzése
            const adminResponse = await fetch("http://localhost:8000/felhasznalok/isadmin", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const adminStatus = await adminResponse.text();
            setIsAdmin(admin === "true");
        } catch (error) {
            console.error("Hiba a felhasználó adatok lekérésekor:", error);
        }
    };

    const loadAnimals = async () => {
        try {
            const response = await fetch("http://localhost:8000/felhasznalok/posztjaim", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAnimals(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Hiba történt az API hívás során:", error);
            setAnimals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await loadUserData();
            await loadAnimals();
            window.scrollTo(0, 0);
        };
        
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-[#F0F4F8]"}`}>
                <div className="text-2xl font-semibold">Betöltés...</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-[#F0F4F8]"}`}>
            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-8">
                {/* SideBarMenu komponens használata */}
                <SideBarMenu 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    isAdmin={isAdmin} 
                />

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