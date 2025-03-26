import React, { useState, useContext } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCamera, FaTrash, FaSave } from 'react-icons/fa';
import UserContext from '../../../context/UserContext';
import { useTheme } from "../../../context/ThemeContext";
import SideBarMenu from './SidebarMenu/SideBarMenu';
import { Link } from "react-router";

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
    const [isAdmin] = useState(user.admin === "true"); // Vagy valamilyen más admin ellenőrzés

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
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-8">
                                {/* Oldalsó menü - most már külön komponens */}
                    <SideBarMenu 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                        isAdmin={isAdmin} 
                    />

                {/* Fő tartalom */}
                <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
                    <div className="flex items-center justify-between mb-10">
                        <h2 className={`text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                            <FaUser className="w-6 h-6 mr-3 text-[#1A73E8]" />
                            Profiladatok
                        </h2>
                    </div>
    
                    {/* Profilkép és gombok */}
                    <div className="flex flex-col items-center space-y-5 mb-10">
                        <div className="relative group">
                            <img
                                src={
                                    uploadedFile
                                        ? URL.createObjectURL(uploadedFile)
                                        : profilePicture
                                            ? `http://localhost:8000/${profilePicture.replace(/\\/g, '/')}?${Date.now()}`
                                            : defaultProfilePicture
                                }
                                alt="Profilkép"
                                className="w-36 h-36 rounded-full object-cover border-4 border-[#1A73E8] shadow-lg"
                            />
                            <label
                                htmlFor="profile-picture-upload"
                                className={`absolute bottom-2 right-2 p-3 rounded-full cursor-pointer transition-all ${
                                    theme === 'dark' 
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                        : 'bg-white hover:bg-gray-100 text-[#1A73E8]'
                                } shadow-md`}
                            >
                                <FaCamera className="w-5 h-5" />
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
                            className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition-colors ${
                                theme === 'dark' 
                                    ? 'text-red-400 bg-red-900/20 hover:bg-red-900/30' 
                                    : 'text-red-600 bg-red-100 hover:bg-red-200'
                            }`}
                        >
                            <FaTrash className="w-4 h-4 mr-2" />
                            Profilkép törlése
                        </button>
                    </div>
    
                    {/* Szerkesztési űrlap */}
                    <div className="space-y-8">
                        {/* Felhasználónév */}
                        <div>
                            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Felhasználónév
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    id="name"
                                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                        theme === 'dark' 
                                            ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                            : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                    }`}
                                    value={isEditingName ? newName : name}
                                    onChange={(e) => setNewName(e.target.value)}
                                    disabled={!isEditingName}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsEditingName(!isEditingName)}
                                    className={`px-5 py-3 rounded-lg font-medium transition-colors ${
                                        theme === 'dark' 
                                            ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white' 
                                            : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                    }`}
                                >
                                    {isEditingName ? 'Mégse' : 'Szerkesztés'}
                                </button>
                            </div>
                        </div>
    
                        {/* Email cím */}
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Email cím
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="email"
                                    id="email"
                                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                        theme === 'dark' 
                                            ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                            : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                    }`}
                                    value={isEditingEmail ? newEmail : email}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    disabled={!isEditingEmail}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                                    className={`px-5 py-3 rounded-lg font-medium transition-colors ${
                                        theme === 'dark' 
                                            ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white' 
                                            : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                                    }`}
                                >
                                    {isEditingEmail ? 'Mégse' : 'Szerkesztés'}
                                </button>
                            </div>
                        </div>
    
                        {/* Jelszó módosítás */}
                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditingPassword(!isEditingPassword)}
                                className={`w-full px-5 py-3.5 rounded-lg font-medium transition-colors ${
                                    theme === 'dark' 
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-[#073F48]'
                                }`}
                            >
                                {isEditingPassword ? 'Jelszóváltoztatás bezárása' : 'Jelszó módosítása'}
                            </button>
    
                            {isEditingPassword && (
                                <div className="mt-6 space-y-6 p-6 rounded-lg bg-opacity-50 ${
                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                }">
                                    <div>
                                        <label htmlFor="oldPassword" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Régi jelszó
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="oldPassword"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                                    theme === 'dark' 
                                                        ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                                        : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                                }`}
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className={`absolute right-3 top-3.5 ${
                                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                }`}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
    
                                    <div>
                                        <label htmlFor="newPassword" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Új jelszó
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="newPassword"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                                theme === 'dark' 
                                                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                                    : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                            }`}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
    
                                    <div>
                                        <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Új jelszó megerősítése
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                                                theme === 'dark' 
                                                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                                    : 'border-gray-300 bg-white text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                            }`}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
    
                                    {passwordError && (
                                        <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                                    )}
    
                                    <button
                                        type="button"
                                        onClick={handlePasswordChange}
                                        className={`w-full px-5 py-3.5 rounded-lg font-medium text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors mt-4`}
                                    >
                                        Jelszó frissítése
                                    </button>
                                </div>
                            )}
                        </div>
    
                        {/* Mentés gomb */}
                        <div className="flex justify-end pt-6">
                            <button
                                type="button"
                                onClick={handleUpdateProfile}
                                className={`px-8 py-3.5 rounded-lg font-medium text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors flex items-center`}
                            >
                                <FaSave className="mr-2" />
                                Változtatások mentése
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileTemplate;