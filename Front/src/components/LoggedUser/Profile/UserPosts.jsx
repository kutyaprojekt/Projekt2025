import React, { useEffect, useState } from 'react';
import UserPostsTemplate from './UserPostsTemplate';

const token = localStorage.getItem("usertoken"); // Token lekérése a localStorage-ból

const UserPosts = () => {
    const [animals, setAnimals] = useState([]); // Kezdetben üres tömb

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

            // Ellenőrizzük, hogy az adat egy tömb
            if (Array.isArray(data)) {
                setAnimals(data);
            } else {
                setAnimals([]);  // Ha nem tömb, üres tömb
            }
        } catch (error) {
            console.error("Hiba történt az API hívás során:", error);
            setAnimals([]);  // Ha hiba történik, üres tömböt állítunk be
        }
    };

    useEffect(() => {
        loadAnimals();
    }, []);

    return (
        <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen pt-20">
            <h1 className="p-5 text-3xl font-bold justify-center text-center mt-10">Posztjaim</h1>
            <div className="flex flex-wrap gap-5 justify-center items-center">
                {animals.length === 0 ? (
                    <p className="text-center text-lg">Nincs posztod még!</p> // Üzenet ha üres
                ) : (
                    animals.map((animal) => (<UserPostsTemplate animal={animal}/>))
                )}
            </div>
        </div>
    );
};

export default UserPosts;

