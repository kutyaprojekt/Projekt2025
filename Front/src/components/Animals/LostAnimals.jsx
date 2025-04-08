import LostAnimalTemplate from "./LostAnimalTemplate";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const LostAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { theme } = useTheme();

    useEffect(() => {
        window.scrollTo(0, 0);
        loadAnimals();
    }, []);

    const loadAnimals = async () => {
        const response = await fetch("http://localhost:8000/felhasznalok/osszallat", {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            }
        });
        const data = await response.json();
        setAnimals(data);
        setFilteredAnimals(data);
    }

    useEffect(() => {
        const filtered = animals.filter(animal => {
            return animal.allatfaj.toLowerCase().includes(searchTerm.toLowerCase()) && 
                   animal.elutasitva === "false";
        });
        setFilteredAnimals(filtered);
    }, [searchTerm, animals]);

    return (
<div className={`flex flex-col items-center p-5 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF] text-[#073F48]"} min-h-screen pt-20`}>
    <h1 className="text-4xl font-extrabold text-center mt-10 mb-4">Elveszett Állatok</h1>
    <p className="text-lg text-center mb-10">Segíts, hogy visszakerüljön a családjához!</p>

    {/* Keresés és szűrés */}
    <div className="flex flex-col items-center mb-8 w-full max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full sm:w-auto">
            <div className="w-full sm:w-96 mt-4 sm:mt-0">
                <input
                    type="text"
                    placeholder="Keresés faj alapján..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`p-3 border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#1A73E8] text-lg w-full ${theme === "dark" ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-[#073F48] placeholder-gray-500"}`}
                />
            </div>
        </div>
    </div>

    {/* Állatok listája */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredAnimals.map((animal) => (
            <LostAnimalTemplate key={animal.id} animal={animal} />
        ))}

    </div>
</div>
    );
}

export default LostAnimals;


