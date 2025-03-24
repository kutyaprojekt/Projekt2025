import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaPhone, FaKey, FaSave, FaTimes, FaUserShield, FaUserEdit } from 'react-icons/fa'; // Add FaUserEdit here

import ConfirmationModal from './ConfirmationModal';
import { useTheme } from '../../context/ThemeContext'; // Téma támogatáshoz

const UserEditModal = ({ user, onUpdate }) => {
    const modalId = `user-modal-${user.id}`;
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [phonenumber, setPhonenumber] = useState(user.phonenumber);
    const [admin, setAdmin] = useState(user.admin);
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const { theme } = useTheme(); // Téma lekérése

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePhoneNumberChange = (e) => setPhonenumber(e.target.value);
    const handleAdminChange = (e) => setAdmin(e.target.value === 'true');
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async () => {
        try {
            const updateData = {
                email,
                username,
                phonenumber,
                admin: admin ? 'true' : 'false',
            };

            if (password) {
                updateData.password = password;
            }

            const response = await fetch(`http://localhost:8000/felhasznalok/felhasznalok/${user.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Szerver válasza:", data);
                document.getElementById(modalId).close();
                onUpdate(); // Frissíti a felhasználók listáját
            } else {
                const errorText = await response.text();
                console.error("Szerver hibája:", errorText);
                alert("Hiba történt a mentés során: " + errorText);
            }
        } catch (error) {
            console.error("Hiba történt a mentés során:", error);
            alert("Hiba történt a mentés során: " + error.message);
        }
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        setIsConfirmationModalOpen(true);
    };

    const handleConfirm = () => {
        setIsConfirmationModalOpen(false);
        handleSubmit();
    };

    const handleCancel = () => {
        setIsConfirmationModalOpen(false);
    };

    return (
        <>
            {/* Megerősítő Modal */}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                message="Biztosan menteni szeretnéd a módosításokat?"
            />

            {/* User Edit Modal */}
            <dialog id={modalId} className="modal">
                <div className={`modal-box ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                    <h3 className="font-bold text-lg flex justify-center items-center gap-2">
                        <div className='text-blue-700'>{user.username}</div>
                        adatainak szerkesztése
                        
                    </h3>
                    <form onSubmit={handleSubmitClick} className="mt-4">
                        {/* E-mail cím */}
                        <div className="form-control mb-4">
                            <label className="label flex items-center gap-2">
                                <FaEnvelope />
                                <span className="label-text">E-mail cím</span>
                            </label>
                            <input
                                type="text"
                                className={`input input-bordered w-full ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>

                        {/* Felhasználónév */}
                        <div className="form-control mb-4">
                            <label className="label flex items-center gap-2">
                                <FaUser />
                                <span className="label-text">Felhasználónév</span>
                            </label>
                            <input
                                type="text"
                                className={`input input-bordered w-full ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>

                        {/* Telefonszám */}
                        <div className="form-control mb-4">
                            <label className="label flex items-center gap-2">
                                <FaPhone />
                                <span className="label-text">Telefonszám</span>
                            </label>
                            <input
                                type="number"
                                className={`input input-bordered w-full ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                                value={phonenumber}
                                onChange={handlePhoneNumberChange}
                            />
                        </div>

                        {/* Admin státusz */}
                        <div className="form-control mb-4">
                            <label className="label flex items-center gap-2">
                                <FaUserShield />
                                <span className="label-text">Admin</span>
                            </label>
                            <select
                                className={`select select-bordered w-full ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                                value={admin ? 'true' : 'false'}
                                onChange={handleAdminChange}
                            >
                                <option value="true">Igen</option>
                                <option value="false">Nem</option>
                            </select>
                        </div>

                        {/* Jelszó módosítása */}
                        {showPasswordField && (
                            <div className="form-control mb-4">
                                <label className="label flex items-center gap-2">
                                    <FaKey />
                                    <span className="label-text">Új jelszó</span>
                                </label>
                                <input
                                    type="password"
                                    className={`input input-bordered w-full ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                        )}

                        {/* Jelszó mező megjelenítése/elrejtése */}
                        <button
                            type="button"
                            className={`btn btn-sm btn-outline w-full mb-4 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                            onClick={() => setShowPasswordField(!showPasswordField)}
                        >
                            <FaKey className="inline-block mr-2" />
                            {showPasswordField ? "Jelszó mező elrejtése" : "Jelszó módosítása"}
                        </button>

                        {/* Művelet gombok */}
                        <div className="modal-action flex justify-end gap-2">
                            <button
                                type="button"
                                className={`btn btn-sm ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                                onClick={() => document.getElementById(modalId).close()}
                            >
                                <FaTimes className="inline-block mr-2" />
                                Bezárás
                            </button>
                            <button
                                type="submit"
                                className={`btn btn-sm ${theme === "dark" ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                            >
                                <FaSave className="inline-block mr-2" />
                                Mentés
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default UserEditModal;