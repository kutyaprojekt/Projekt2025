import React, { useEffect, useState } from 'react';
import FoundAnimalsTemplate from './FoundAnimalsTemplate';

const FoundAnimals = () => {
    const [animals, setAnimals] = useState([]);

    const loadAnimals = async () => {
        try {
            const response = await fetch("http://localhost:8000/felhasznalok/megtalaltallatok", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error("Hiba történt az adatok lekérése során");
            }

            const data = await response.json();
            setAnimals(data);
        } catch (error) {
            console.error("Hiba történt az állatok lekérése során:", error);
        }
    };

    useEffect(() => {
        loadAnimals();
        window.scroll(0,0);
    }, []);

    return (
        <div className="flex flex-col items-center p-5 bg-gradient-to-r from-[#63E2C6] to-[#5ABCB9] min-h-screen pt-20">
            <h1 className="text-3xl font-bold text-center mt-10 text-[#074F57]">Megtalált Állatok</h1>
            <div className="flex justify-center w-full mt-20">
                {/* Grid konténer, középre igazítva */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center">
                    {animals.map((animal) => (
                        <FoundAnimalsTemplate key={animal.id} animal={animal} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoundAnimals;