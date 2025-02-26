import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const UserEditModal = ({ user, onUpdate }) => {
    const modalId = `user-modal-${user.id}`;
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [phonenumber, setPhonenumber] = useState(user.phonenumber);
    const [admin, setAdmin] = useState(user.admin);
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Állapot a megerősítő modalhoz

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePhoneNumberChange = (e) => setPhonenumber(e.target.value);
    const handleAdminChange = (e) => setAdmin(e.target.value === 'true'); // Szövegből boolean értékké alakítjuk
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async () => {
        try {
            const updateData = { 
                email, 
                username, 
                phonenumber,  // Telefonszám hozzáadva
                admin: admin ? 'true' : 'false',  // A boolean admin értéket szöveggé alakítjuk
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
        e.preventDefault(); // Megakadályozzuk az oldal újratöltését
        setIsConfirmationModalOpen(true); // Megnyitjuk a megerősítő modalt
    };

    const handleConfirm = () => {
        setIsConfirmationModalOpen(false); // Bezárjuk a megerősítő modalt
        handleSubmit(); // Elküldjük az adatokat
    };

    const handleCancel = () => {
        setIsConfirmationModalOpen(false); // Bezárjuk a megerősítő modalt
    };

    return (
        <>            {/* Megerősítő Modal */}
        <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            message="Biztosan menteni szeretnéd a módosításokat?"
        />
        
            <dialog id={modalId} className="modal">
                
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{user.username} adatai</h3>
                    <form onSubmit={handleSubmitClick}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">E-mail cím</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Felhasználónév</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Telefonszám</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered"
                                value={phonenumber}
                                onChange={handlePhoneNumberChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Admin</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={admin ? 'true' : 'false'}  // A boolean értéket szöveggé alakítjuk
                                onChange={handleAdminChange}
                            >
                                <option value="true">Igen</option>
                                <option value="false">Nem</option>
                            </select>
                        </div>

                        {showPasswordField && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Új jelszó</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                        )}

                        <button
                            className="btn btn-sm btn-outline mt-3"
                            onClick={() => setShowPasswordField(!showPasswordField)}
                        >
                            {showPasswordField ? "Jelszó mező elrejtése" : "Jelszó módosítása"}
                        </button>

                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => document.getElementById(modalId).close()}>Close</button>
                            <button type="submit" className="btn" onClick={handleSubmitClick}>Submit</button>
                        </div>
                    </form>
                </div>
            </dialog>


        </>
    );
};

export default UserEditModal;