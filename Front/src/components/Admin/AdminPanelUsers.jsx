import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import { FaPhoneAlt, FaEnvelope, FaUserEdit, FaTrashAlt, FaUser, FaUserShield } from 'react-icons/fa'; // FontAwesome icons
import UserContext from '../../context/UserContext';
import UserEditModal from './UserEditModal';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

const AdminPanelUsers = () => {
    const [adatok, setAdatok] = useState({ animals: [], users: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem("usertoken");
    const { user } = useContext(UserContext);
    const { theme } = useTheme(); // Get the current theme

    const loadAdatok = async () => {
        try {
            if (!token) {
                throw new Error("Nincs token! Jelentkezz be.");
            }

            const response = await fetch("http://localhost:8000/felhasznalok/adminusers", {
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
            setAdatok(data || { animals: [], users: [] });
        } catch (error) {
            console.error("Hiba történt az adatok lekérése során:", error);
            setAdatok({ animals: [], users: [] });
        }
    };

    useEffect(() => {
        loadAdatok();
        window.scrollTo(0, 0);
    }, []);

    const handleDeleteUser = async (userId) => {
        const isConfirmed = window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:8000/felhasznalok/${userId}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Szerver válasza:", data);
                toast.success("Felhasználó törölve!"); // Success toast
                loadAdatok(); // Frissítjük a felhasználók listáját
            } else {
                const errorText = await response.text();
                console.error("Szerver hibája:", errorText);
                toast.error("Hiba történt a törlés során: " + errorText); // Error toast
            }
        } catch (error) {
            console.error("Hiba történt a törlés során:", error);
            toast.error("Hiba történt a törlés során: " + error.message); // Error toast
        }
    };

    const filteredUsers = adatok.users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF] text-[#073F48]"}`}>
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-4xl font-extrabold text-center mt-16 mb-4">Összes felhasználó</h1>

                {/* Keresés mező */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Keresés felhasználók között..."
                        className={`input input-bordered w-full max-w-sm p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-[#073F48] border-[#1A73E8]"}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Táblázat */}
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className={`table-auto w-full ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#073F48]"}`}>
                        <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-blue-600 text-white"}`}>
                            <tr>
                                <th className="py-3 px-5 text-left">
                                    <FaUser className="inline-block mr-2" />
                                    Felhasználónév
                                </th>
                                <th className="py-3 px-5 text-left">
                                    <FaEnvelope className="inline-block mr-2" />
                                    E-mail
                                </th>
                                <th className="py-3 px-5 text-left">
                                    <FaPhoneAlt className="inline-block mr-2" />
                                    Telefonszám
                                </th>
                                <th className="py-3 px-5 text-left">
                                    <FaUserShield className="inline-block mr-2" />
                                    Admin
                                </th>
                                <th className="py-3 px-5 text-center">
                                    Műveletek
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className={`${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 border-gray-700" : "bg-white hover:bg-gray-100 border-gray-200"}`}>
                                    <td className="py-3 px-5">{user.username}</td>
                                    <td className="py-3 px-5">{user.email}</td>
                                    <td className="py-3 px-5">{user.phonenumber}</td>
                                    <td className="py-3 px-5">{user.admin === "true" ? "Igen" : "Nem"}</td>
                                    <td className="py-3 px-5">
                                        <div className="flex justify-end gap-4">
                                            <button
                                                className={`btn btn-sm px-4 py-2 rounded-full ${theme === "dark" ? "bg-blue-700 hover:bg-blue-800 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                                onClick={() => {
                                                    document.getElementById(`user-modal-${user.id}`).showModal();
                                                }}
                                            >
                                                <FaUserEdit className="inline-block mr-2" />
                                                Szerkesztés
                                            </button>
                                            <UserEditModal user={user} onUpdate={loadAdatok} />
                                            <button
                                                className={`btn btn-sm px-4 py-2 rounded-full ${theme === "dark" ? "bg-red-700 hover:bg-red-800 text-white"  : "bg-red-600 hover:bg-red-700 text-white"}`}
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <FaTrashAlt className="inline-block mr-2" />
                                                Törlés
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Toast notifications container */}
            <ToastContainer />
        </div>
    );
};

export default AdminPanelUsers;