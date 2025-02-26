import LostAnimalTemplate from "./LostAnimalTemplate";
import React, { useEffect, useState} from "react";

const LostAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("name"); // "name" vagy "species"

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
            if (searchType === "name") {
                return animal.nev.toLowerCase().includes(searchTerm.toLowerCase());
            } else {
                return animal.allatfaj.toLowerCase().includes(searchTerm.toLowerCase());
            }
        });
        setFilteredAnimals(filtered);
    }, [searchTerm, searchType, animals]);

    return (
        <div className="flex flex-col items-center p-5 bg-gradient-to-r from-[#63E2C6] to-[#5ABCB9] min-h-screen pt-20"> 
            <h1 className="text-3xl font-bold text-center mt-10 text-[#074F57]">Elveszett Állatok</h1>
            <p className="text-center mb-10 text-[#074F57]">Segíts, hogy visszakerüljön a családjához!</p>
            <div className="flex flex-col items-center mb-6 w-full max-w-2xl">
                <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full"> 
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="p-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57] w-full sm:w-auto" 
                    >
                        <option value="name">Név</option>
                        <option value="species">Faj</option>
                    </select>
                    <input
                        type="text"
                        placeholder={`Keresés ${searchType === "name" ? "név" : "faj"} alapján...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57] w-full"
                    />
                </div>
            </div>
            <div className="flex justify-center w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl">
                    {filteredAnimals.map((animal) => (
                        <LostAnimalTemplate key={animal.id} animal={animal} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LostAnimals;