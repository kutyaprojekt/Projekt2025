import React, { useState, useContext } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCamera, FaTrash, FaSave } from 'react-icons/fa';
import UserContext from '../../../context/UserContext';
import { useTheme } from "../../../context/ThemeContext";

const MyProfileTemplate = ({ user }) => {
    const { refresh, SetRefresh } = useContext(UserContext);
    const { theme } = useTheme();
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
    const [showPassword, setShowPassword] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const token = localStorage.getItem("usertoken");
    const [activeTab, setActiveTab] = useState('profilom');

    const defaultProfilePicture = '/default-profile.jpg';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert('Kérjük, válasszon ki egy fájlt!');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedFile(file);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteProfilePicture = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/delete-profile-picture', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Kép törlése sikertelen');
            }

            setProfilePicture('');
            setUploadedFile(null);
            SetRefresh((prev) => !prev);
        } catch (error) {
            console.error('Hiba történt:', error);
            alert('Hiba történt a kép törlése során.');
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Az új jelszavak nem egyeznek.');
            return;
        }

        try {
            const userId = user.id;
            const response = await fetch(`http://localhost:8000/felhasznalok/${userId}/update-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Szerver hiba:", errorText);
                throw new Error(errorText || 'Jelszó módosítása sikertelen');
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
            alert(error.message);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const userId = user.id;

            if (uploadedFile) {
                const formData = new FormData();
                formData.append('file', uploadedFile);

                const uploadResponse = await fetch('http://localhost:8000/api/upload-profile-picture', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Kép feltöltése sikertelen');
                }

                const uploadData = await uploadResponse.json();
                setProfilePicture(uploadData.filePath);
            }

            const response = await fetch(`http://localhost:8000/felhasznalok/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newEmail, name: newName }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Szerver hiba:", errorText);
                throw new Error(errorText || 'Profil frissítése sikertelen');
            }

            const data = await response.json();
            console.log('Profil frissítve:', data);
            setIsEditingEmail(false);
            setIsEditingName(false);
            setEmail(newEmail);
            setName(newName);
            setUploadedFile(null);
            SetRefresh((prev) => !prev);
        } catch (error) {
            console.error('Hiba történt:', error);
            alert(error.message);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF] text-[#073F48]'}`}>
            {/* Navbar (külön komponensben van, így nem kell itt módosítani) */}
    
            {/* Fő tartalom */}
            <main className="flex-1 flex flex-col md:flex-row gap-8 px-4 md:px-8 lg:px-16 pt-20 pb-20"> {/* Padding bottom hozzáadva */}
                {/* Oldalsó menü */}
                <aside className="w-full md:w-1/4 lg:w-1/5">
                    <div className={`sticky top-20 flex flex-col gap-3 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#1A73E8]'} border`}>
                        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>Beállítások</h2>
                        <button
                            onClick={() => setActiveTab('profilom')}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'profilom'
                                    ? `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-[#1A73E8] text-white'}`
                                    : `${theme === 'dark' ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-[#1A73E8] hover:text-white'}`
                                }`}
                        >
                            <FaUser className="mr-3" /> Profilom
                        </button>
                        <button
                            onClick={() => setActiveTab('posztjaim')}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'posztjaim'
                                    ? `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-[#1A73E8] text-white'}`
                                    : `${theme === 'dark' ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-[#1A73E8] hover:text-white'}`
                                }`}
                        >
                            <FaEnvelope className="mr-3" /> Posztjaim
                        </button>
                        <button
                            onClick={() => setActiveTab('uzenetek')}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'uzenetek'
                                    ? `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-[#1A73E8] text-white'}`
                                    : `${theme === 'dark' ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-[#1A73E8] hover:text-white'}`
                                }`}
                        >
                            <FaLock className="mr-3" /> Üzenetek
                        </button>
                    </div>
                </aside>
    
                {/* Fő tartalom */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-lg`}>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className={`text-3xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                <FaUser className="w-8 h-8 mr-2 text-[#1A73E8]" />
                                Publikus profil
                            </h2>
                        </div>
    
                        {/* Profilkép és gombok */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative">
                                <img
                                    src={
                                        uploadedFile
                                            ? URL.createObjectURL(uploadedFile)
                                            : profilePicture
                                                ? `http://localhost:8000/${profilePicture.replace(/\\/g, '/')}?${Date.now()}`
                                                : defaultProfilePicture
                                    }
                                    alt="Profilkép"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-[#1A73E8] shadow-lg"
                                />
                                <label
                                    htmlFor="profile-picture-upload"
                                    className="absolute bottom-0 right-0 bg-[#1A73E8] p-2 rounded-full cursor-pointer shadow-md hover:bg-[#1557B0] transition-colors"
                                >
                                    <FaCamera className="w-6 h-6 text-white" />
                                </label>
                                <input
                                    type="file"
                                    onChange={handleProfilePictureUpload}
                                    className="hidden"
                                    id="profile-picture-upload"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleDeleteProfilePicture}
                                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <FaTrash className="w-5 h-5 mr-2" />
                                Kép törlése
                            </button>
                        </div>
    
                        {/* Név és email mezők */}
                        <div className="mt-8 space-y-6">
                            {/* Felhasználónév módosítása */}
                            <div className="space-y-2">
                                <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                    Felhasználónév
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        id="name"
                                        className={`flex-1 p-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#1A73E8] bg-white text-[#073F48]'
                                            } rounded-lg focus:ring-[#1A73E8] focus:border-[#1A73E8]`}
                                        placeholder="Felhasználónév"
                                        value={isEditingName ? newName : name}
                                        onChange={(e) => setNewName(e.target.value)}
                                        disabled={!isEditingName}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingName(!isEditingName)}
                                        className={`p-2 text-sm font-medium ${theme === 'dark' ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-white bg-[#1A73E8] hover:bg-[#1557B0]'
                                            } rounded-lg transition-colors`}
                                    >
                                        {isEditingName ? 'Mégse' : 'Módosítás'}
                                    </button>
                                </div>
                            </div>
    
                            {/* Email cím módosítása */}
                            <div className="space-y-2">
                                <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                    Email cím
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="email"
                                        id="email"
                                        className={`flex-1 p-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#1A73E8] bg-white text-[#073F48]'
                                            } rounded-lg focus:ring-[#1A73E8] focus:border-[#1A73E8]`}
                                        placeholder="email@example.com"
                                        value={isEditingEmail ? newEmail : email}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        disabled={!isEditingEmail}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingEmail(!isEditingEmail)}
                                        className={`p-2 text-sm font-medium ${theme === 'dark' ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-white bg-[#1A73E8] hover:bg-[#1557B0]'
                                            } rounded-lg transition-colors`}
                                    >
                                        {isEditingEmail ? 'Mégse' : 'Módosítás'}
                                    </button>
                                </div>
                            </div>
    
                            {/* Jelszó módosítása */}
                            {isEditingPassword && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="oldPassword" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                            Régi jelszó
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="oldPassword"
                                            className={`w-full p-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#1A73E8] bg-white text-[#073F48]'
                                                } rounded-lg focus:ring-[#1A73E8] focus:border-[#1A73E8]`}
                                            placeholder="Régi jelszó"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="newPassword" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                            Új jelszó
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="newPassword"
                                                className={`w-full p-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#1A73E8] bg-white text-[#073F48]'
                                                    } rounded-lg focus:ring-[#1A73E8] focus:border-[#1A73E8]`}
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
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="confirmPassword" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                            Új jelszó megerősítése
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            className={`w-full p-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-[#1A73E8] bg-white text-[#073F48]'
                                                } rounded-lg focus:ring-[#1A73E8] focus:border-[#1A73E8]`}
                                            placeholder="Új jelszó megerősítése"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    {passwordError && (
                                        <p className="text-red-500 text-sm">{passwordError}</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handlePasswordChange}
                                        className={`w-full p-2 text-sm font-medium text-white bg-[#1A73E8] rounded-lg hover:bg-[#1557B0] transition-colors`}
                                    >
                                        Jelszó módosítása
                                    </button>
                                </div>
                            )}
    
                            {/* Jelszó módosítás gomb */}
                            <button
                                type="button"
                                onClick={() => setIsEditingPassword(!isEditingPassword)}
                                className={`w-full p-2 text-sm font-medium ${theme === 'dark' ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-white bg-[#1A73E8] hover:bg-[#1557B0]'
                                    } rounded-lg transition-colors`}
                            >
                                {isEditingPassword ? 'Mégse' : 'Jelszó módosítása'}
                            </button>
    
                            {/* Mentés gomb */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleUpdateProfile}
                                    className={`px-6 py-2 text-sm font-medium text-white bg-[#1A73E8] rounded-lg hover:bg-[#1557B0] transition-colors`}
                                >
                                    <FaSave className="inline-block mr-2" />
                                    Mentés
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
    
            {/* Footer (külön komponensben van, így nem kell itt módosítani) */}
        </div>
    );
};

export default MyProfileTemplate;