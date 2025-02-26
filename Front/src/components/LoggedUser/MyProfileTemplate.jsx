import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const MyProfileTemplate = ({ user }) => {
    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState(user.username || '');
    const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newEmail, setNewEmail] = useState(user.email);
    const [newName, setNewName] = useState(user.username || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Jelszó láthatóságának állapota
    const token = localStorage.getItem("usertoken");

    // Jelszó láthatóságának váltása
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Profilkép feltöltése
    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload-profile-picture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Kép feltöltése sikertelen');
            }

            const data = await response.json();
            setProfilePicture(data.filePath); // Frissíti a profilkép állapotát
        } catch (error) {
            console.error('Hiba történt:', error);
        }
    };

    // Jelszó módosítása
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Az új jelszavak nem egyeznek.');
            return;
        }

        try {
            const response = await fetch('/api/profile/update-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (!response.ok) {
                throw new Error('Jelszó módosítása sikertelen');
            }

            const data = await response.json();
            console.log('Jelszó frissítve:', data);
            setIsEditingPassword(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
        } catch (error) {
            console.error('Hiba történt:', error);
            setPasswordError('Hibás régi jelszó vagy egyéb hiba.');
        }
    };

    // Adatok frissítése
    const handleUpdateProfile = async () => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newEmail, name: newName }),
            });

            if (!response.ok) {
                throw new Error('Profil frissítése sikertelen');
            }

            const data = await response.json();
            console.log('Profil frissítve:', data);
            setIsEditingEmail(false);
            setIsEditingName(false);
            setEmail(newEmail);
            setName(newName);
        } catch (error) {
            console.error('Hiba történt:', error);
        }
    };

    return (
        <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931] pt-20">
            {/* Oldalsó menü */}
            <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-20">
                    <h2 className="pl-3 mb-4 text-2xl font-semibold">Beállítások</h2>
                    <a href="#" className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-full">
                        Profilom
                    </a>
                    <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
                        Posztjaim
                    </a>
                </div>
            </aside>

            {/* Fő tartalom */}
            <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                <div className="p-2 md:p-4">
                    <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                        <h2 className="pl-6 text-2xl font-bold sm:text-xl">Publikus profil</h2>

                        {/* Profilkép és gombok */}
                        <div className="grid max-w-2xl mx-auto mt-8">
                            <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                <img
                                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300"
                                    src={profilePicture || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"}
                                    alt="Profilkép"
                                />
                                <div className="flex flex-col space-y-5 sm:ml-8">
                                    <input
                                        type="file"
                                        onChange={handleProfilePictureUpload}
                                        className="hidden"
                                        id="profile-picture-upload"
                                    />
                                    <label
                                        htmlFor="profile-picture-upload"
                                        className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 cursor-pointer"
                                    >
                                        Kép módosítása
                                    </label>
                                    <button
                                        type="button"
                                        className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200"
                                    >
                                        Kép törlése
                                    </button>
                                </div>
                            </div>

                            {/* Név és email mezők */}
                            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                {/* Felhasználónév módosítása */}
                                <div className="mb-2 sm:mb-6">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-indigo-900">
                                        Felhasználónév
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            id="name"
                                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                            placeholder="Felhasználónév"
                                            value={isEditingName ? newName : name}
                                            onChange={(e) => setNewName(e.target.value)}
                                            disabled={!isEditingName}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingName(!isEditingName)}
                                            className="py-2 px-4 text-sm font-medium text-indigo-900 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-100 focus:ring-4 focus:ring-indigo-200"
                                        >
                                            {isEditingName ? 'Mégse' : 'Módosítás'}
                                        </button>
                                    </div>
                                </div>

                                {/* Email cím módosítása */}
                                <div className="mb-2 sm:mb-6">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-900">
                                        Email cím
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="email"
                                            id="email"
                                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                            placeholder="email@example.com"
                                            value={isEditingEmail ? newEmail : email}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            disabled={!isEditingEmail}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingEmail(!isEditingEmail)}
                                            className="py-2 px-4 text-sm font-medium text-indigo-900 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-100 focus:ring-4 focus:ring-indigo-200"
                                        >
                                            {isEditingEmail ? 'Mégse' : 'Módosítás'}
                                        </button>
                                    </div>
                                </div>

                                {/* Jelszó módosítása */}
                                {isEditingPassword && (
                                    <div className="mb-2 sm:mb-6">
                                        <label htmlFor="oldPassword" className="block mb-2 text-sm font-medium text-indigo-900">
                                            Régi jelszó
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="oldPassword"
                                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                            placeholder="Régi jelszó"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                        <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-indigo-900 mt-4">
                                            Új jelszó
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="newPassword"
                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                                placeholder="Új jelszó"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-indigo-900 mt-4">
                                            Új jelszó megerősítése
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                            placeholder="Új jelszó megerősítése"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {passwordError && (
                                            <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handlePasswordChange}
                                            className="mt-4 py-2 px-4 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-200"
                                        >
                                            Jelszó módosítása
                                        </button>
                                    </div>
                                )}

                                {/* Jelszó módosítás gomb */}
                                <div className="mb-2 sm:mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingPassword(!isEditingPassword)}
                                        className="py-2 px-4 text-sm font-medium text-indigo-900 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-100 focus:ring-4 focus:ring-indigo-200"
                                    >
                                        {isEditingPassword ? 'Mégse' : 'Jelszó módosítása'}
                                    </button>
                                </div>

                                {/* Mentés gomb */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleUpdateProfile}
                                        className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                    >
                                        Mentés
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyProfileTemplate;