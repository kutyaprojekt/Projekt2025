import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import { useTheme } from "../../context/ThemeContext"; // Importáljuk a useTheme hookot
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal'; // Modal komponens importálása
import { FaInfoCircle, FaCheck, FaTrash, FaUser, FaPaw } from 'react-icons/fa'; // Ikonok importálása

Modal.setAppElement('#root'); // A modal hozzárendelése az alkalmazás gyökéreleméhez

const AdminPanelPosts = () => {
    const [adatok, setAdatok] = useState([]); // Az összes állat adatait tároljuk
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState(null); // Kiválasztott állat adatai
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal állapota
    const [filter, setFilter] = useState('all'); // Szűrő állapota: 'all', 'approved', 'pending'
    const token = localStorage.getItem("usertoken");
    const { user } = useContext(UserContext);
    const { theme } = useTheme(); // Téma állapot

    // Állatok betöltése
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
            setAdatok(data.animals || []); // Az összes állat adatait tároljuk
        } catch (error) {
            console.error("Hiba történt az adatok lekérése során:", error);
            setAdatok([]);
        }
    };

    useEffect(() => {
        loadAdatok();
        window.scrollTo(0, 0);
    }, []);

    // Állat törlése
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
                toast.success("Állat sikeresen törölve!");
            } else {
                const errorText = await response.text();
                console.error("Szerver hibája:", errorText);
                toast.error("Hiba történt a törlés során: " + errorText);
            }
        } catch (error) {
            console.error("Hiba történt a törlés során:", error);
            toast.error("Hiba történt a törlés során: " + error.message);
        }
    };

    // Állat jóváhagyása
    const handleApproveAnimal = async (animalId) => {
        try {
            const response = await fetch(`http://localhost:8000/felhasznalok/allatok/${animalId}/jovahagy`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Szerver válasza:", data);
                loadAdatok(); // Frissítjük az állatok listáját
                toast.success("Állat sikeresen jóváhagyva!");
            } else {
                const errorText = await response.text();
                console.error("Szerver hibája:", errorText);
                toast.error("Hiba történt a jóváhagyás során: " + errorText);
            }
        } catch (error) {
            console.error("Hiba történt a jóváhagyás során:", error);
            toast.error("Hiba történt a jóváhagyás során: " + error.message);
        }
    };

    // Keresés az állatok között
    const filteredAnimals = adatok.filter(animal => {
        const matchesSearch = animal.nev.toLowerCase().includes(searchTerm.toLowerCase()) || // Állat neve alapján keresés
            animal.allatfaj.toLowerCase().includes(searchTerm.toLowerCase()); // Állat fajta alapján keresés

        if (filter === 'all') {
            return matchesSearch;
        } else if (filter === 'approved') {
            return matchesSearch && animal.approved;
        } else if (filter === 'pending') {
            return matchesSearch && !animal.approved;
        }
        return false;
    });

    // Modal megnyitása
    const openModal = (animal) => {
        setSelectedAnimal(animal);
        setModalIsOpen(true);
    };

    // Modal bezárása
    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF] text-[#073F48]"}`}>
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-4xl font-extrabold text-center mt-16 mb-4">Összes poszt</h1>

                {/* Keresés és szűrő */}
                <div className="flex justify-center mb-6 gap-4">
                    <input
                        type="text"
                        placeholder="Keresés állatok között..."
                        className={`input input-bordered w-full max-w-sm p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-[#073F48] border-[#1A73E8]"}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className={`select select-bordered w-full max-w-xs ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-[#073F48] border-[#1A73E8]"}`}
                    >
                        <option value="all">Összes</option>
                        <option value="approved">Jóváhagyottak</option>
                        <option value="pending">Jóváhagyásra várók</option>
                    </select>
                </div>

                {/* Táblázat */}
                <div className="overflow-x-auto shadow-lg rounded-lg">
    <table className={`table-auto w-full ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#073F48]"}`}>
        <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-blue-600 text-white"}`}>
            <tr>
                <th className="py-3 px-5 text-left">
                    <FaPaw className="inline-block mr-2" />
                    Név
                </th>
                <th className="py-3 px-5 text-left">
                    <FaPaw className="inline-block mr-2" />
                    Faj
                </th>
                <th className="py-3 px-5 text-left">
                    <FaPaw className="inline-block mr-2" />
                    Státusz
                </th>
                <th className="py-3 px-5 text-center">
                    Műveletek
                </th>
            </tr>
        </thead>
        <tbody>
            {filteredAnimals.map((animal) => (
                <tr key={animal.id} className={`${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"}`}>
                    <td className="py-3 px-5">{animal.nev}</td>
                    <td className="py-3 px-5">{animal.allatfaj}</td>
                    <td className="py-3 px-5">
                        {animal.approved ? (
                            <span className="text-green-600">Jóváhagyva</span>
                        ) : (
                            <span className="text-yellow-600">Jóváhagyásra vár</span>
                        )}
                    </td>
                    <td className="py-3 px-5">
                        <div className="flex justify-end gap-4">
                            {!animal.approved && (
                                <button
                                    className={`btn btn-sm px-4 py-2 rounded-full ${theme === "dark" ? "bg-green-700 hover:bg-green-800 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
                                    onClick={() => handleApproveAnimal(animal.id)}
                                >
                                    <FaCheck className="inline-block mr-2" />
                                    Jóváhagyás
                                </button>
                            )}
                            <button
                                className={`btn btn-sm px-4 py-2 rounded-full ${theme === "dark" ? "bg-red-700 hover:bg-red-800 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                                onClick={() => handleDeleteAnimal(animal.id)}
                            >
                                <FaTrash className="inline-block mr-2" />
                                Törlés
                            </button>
                            <span
                                className={`inline-flex items-center cursor-pointer ${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"}`}
                                onClick={() => openModal(animal)}
                            >
                                <FaInfoCircle size={20} />
                            </span>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


            </div>

            {/* Modal az állat részletes adataihoz */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Állat részletes adatai"
                className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg p-6 w-11/12 max-w-4xl mx-auto mt-20 relative`}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                {selectedAnimal && (
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Kép */}
                        {selectedAnimal.filePath && (
                            <div className="flex justify-center md:justify-start">
                                <img
                                    src={`http://localhost:8000/${selectedAnimal.filePath}`}
                                    alt={selectedAnimal.nev}
                                    className="w-48 h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}
                        {/* Adatok */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-4">{selectedAnimal.nev} adatai</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p><strong>Faj:</strong> {selectedAnimal.allatfaj}</p>
                                    <p><strong>Kategória:</strong> {selectedAnimal.kategoria}</p>
                                    <p><strong>Név:</strong> {selectedAnimal.nev}</p>
                                </div>
                                <div>
                                    <p><strong>Szín:</strong> {selectedAnimal.szin}</p>
                                    <p><strong>Méret:</strong> {selectedAnimal.meret}</p>
                                    <p><strong>Eltűnés helyszíne:</strong> {selectedAnimal.eltuneshelyszine}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p><strong>Egyéb információk:</strong> {selectedAnimal.egyeb_infok}</p>
                                <p><strong>Státusz:</strong> {selectedAnimal.approved ? "Jóváhagyva" : "Jóváhagyásra vár"}</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Bezárás gomb */}
                <button
                    className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-semibold ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} text-gray-900`}
                    onClick={closeModal}
                >
                    Bezárás
                </button>
            </Modal>

            {/* Toast notifications container */}
            <ToastContainer />
        </div>
    );
};

export default AdminPanelPosts;