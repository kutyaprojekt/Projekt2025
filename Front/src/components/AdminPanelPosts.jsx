import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../context/UserContext';

const AdminPanelPosts = () => {
    const [adatok, setAdatok] = useState([]); // Csak az állatok adatait tároljuk
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem("usertoken");
    const { user } = useContext(UserContext);

    const loadAdatok = async () => {
        try {
            if (!token) {
                throw new Error("Nincs token! Jelentkezz be.");
            }

            const response = await fetch("http://localhost:8000/felhasznalok/adminposts", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Hiba történt az adatok lekérése során");
            }

            const data = await response.json();
            setAdatok(data.animals || []); // Csak az állatok adatait tároljuk
        } catch (error) {
            console.error("Hiba történt az adatok lekérése során:", error);
            setAdatok([]);
        }
    };

    useEffect(() => {
        loadAdatok();
    }, []);

    const handleDeleteAnimal = async (animalId) => {
        const isConfirmed = window.confirm("Biztosan törölni szeretnéd ezt az állatot?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:8000/felhasznalok/allatok/${animalId}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Szerver válasza:", data);
                loadAdatok(); // Frissítjük az állatok listáját
            } else {
                const errorText = await response.text();
                console.error("Szerver hibája:", errorText);
                alert("Hiba történt a törlés során: " + errorText);
            }
        } catch (error) {
            console.error("Hiba történt a törlés során:", error);
            alert("Hiba történt a törlés során: " + error.message);
        }
    };

    const filteredAnimals = adatok.filter(animal =>
        animal.nev.toLowerCase().includes(searchTerm.toLowerCase()) || // Állat neve alapján keresés
        animal.allatfaj.toLowerCase().includes(searchTerm.toLowerCase()) // Állat fajta alapján keresés
    );

    return (
        <div className="flex flex-col gap-5 p-5">
            <h1 className="text-3xl font-bold">Üdvözöljük <span className="text-red-600">{user.username}</span>!</h1>
            <h1 className="text-3xl font-bold justify-center text-center mt-10">Összes Poszt</h1>

            <input
                type="text"
                placeholder="Keresés állatok között..."
                className="input input-bordered w-full max-w-xs mb-5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Talalt V Nem</th>
                            <th>Allatfaj</th>
                            <th>Kategória</th>
                            <th>Név</th>
                            <th>Dátum</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAnimals.map((animal) => (
                            <tr key={animal.id}>
                                <td>{animal.talalt_elveszett}</td>
                                <td>{animal.allatfaj}</td>
                                <td>{animal.kategoria}</td>
                                <td>{animal.nev}</td>
                                <td>{animal.datum}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => handleDeleteAnimal(animal.id)}
                                    >
                                        Törlés
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanelPosts;