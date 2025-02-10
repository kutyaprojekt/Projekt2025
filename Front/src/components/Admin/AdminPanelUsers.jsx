import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import UserEditModal from '../UserEditModal';

const AdminPanelUsers = () => {
    const [adatok, setAdatok] = useState({ animals: [], users: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem("usertoken");
    const { user } = useContext(UserContext);

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
    }, []);

    const handleDeleteUser = async (userId) => {
        const isConfirmed = window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?");
        if (!isConfirmed) return; // Ha a felhasználó nem erősítette meg, kilépünk

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
                loadAdatok(); // Frissítjük a felhasználók listáját
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

    const filteredUsers = adatok.users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-5 p-5">
            <h1 className="text-3xl font-bold">Üdvözöljük <span className="text-red-600">{user.username}</span>!</h1>
            <h1 className="text-3xl font-bold justify-center text-center mt-10">Összes felhasználó</h1>

            <input
                type="text"
                placeholder="Keresés felhasználók között..."
                className="input input-bordered w-full max-w-xs mb-5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Felhasználónév</th>
                            <th>E-mail</th>
                            <th>Telefonszám</th>
                            <th>Admin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phonenumber}</td>
                                <td>{user.admin === "true" ? "Igen" : "Nem"}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-info"
                                        onClick={() => {
                                            console.log("Modal megnyitva:", `user-modal-${user.id}`);
                                            document.getElementById(`user-modal-${user.id}`).showModal();
                                        }}
                                    >
                                        Szerkesztés
                                    </button>
                                    <UserEditModal user={user} onUpdate={loadAdatok} />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => handleDeleteUser(user.id)}
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

export default AdminPanelUsers;