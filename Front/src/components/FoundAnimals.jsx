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
    }, []);

    return (
        <div className="flex flex-col gap-5 pl-5">
            <h1 className="text-3xl font-bold justify-center text-center mt-10">Megtalállt Állatok</h1>
            <div className="flex flex-wrap gap-5 justify-center items-center">
                {animals.map((animal) => (
                    <FoundAnimalsTemplate key={animal.id} animal={animal} />
                ))}
            </div>
        </div>
    );
};

export default FoundAnimals;