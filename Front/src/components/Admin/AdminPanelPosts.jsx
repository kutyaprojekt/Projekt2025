import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import { useTheme } from "../../context/ThemeContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { FaInfoCircle, FaCheck, FaTrash, FaTimes, FaCommentDots, FaPaw, FaSearch, FaUserShield } from 'react-icons/fa';
import SideBarMenu from '../LoggedUser/Profile/SidebarMenu/SideBarMenu';

Modal.setAppElement('#root');

const AdminPanelPosts = () => {
    const [adatok, setAdatok] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [rejectionReason, setRejectionReason] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [activeTab, setActiveTab] = useState('posztok');
    
    const token = localStorage.getItem("usertoken");
    const { user } = useContext(UserContext);
    const { theme } = useTheme();
    const isAdmin = user?.admin === "true";

    // Predefined rejection reasons
    const predefinedReasons = [
        "Helytelen állatfaj",
        "Hiányzó helyszín",
        "Nem megfelelő kép",
        "Túl kevés információ"
    ];

    const loadAdatok = async () => {
        try {
            if (!token) throw new Error("Nincs token! Jelentkezz be.");

            const response = await fetch("http://localhost:8000/felhasznalok/adminposts", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Hiba történt az adatok lekérése során");

            const data = await response.json();
            setAdatok(data.animals || []);
        } catch (error) {
            console.error("Hiba történt az adatok lekérése során:", error);
            setAdatok([]);
        }
    };

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
                loadAdatok();
                toast.success("Állat sikeresen törölve!");
            } else {
                const errorText = await response.text();
                toast.error("Hiba történt a törlés során: " + errorText);
            }
        } catch (error) {
            toast.error("Hiba történt a törlés során: " + error.message);
        }
    };

    const handleApproveAnimal = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/felhasznalok/allatok/${id}/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Hiba történt a jóváhagyás során');
            }

            toast.success('Poszt sikeresen jóváhagyva!');
            loadAdatok(); // Frissítjük a posztok listáját
        } catch (error) {
            console.error('Hiba:', error);
            toast.error(error.message || 'Hiba történt a jóváhagyás során');
        }
    };

    const handleRejectAnimal = async (animalId) => {
        if (!rejectionReason) {
            toast.error("Válassz elutasítási okot!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/felhasznalok/allatok/${animalId}/elutasit`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    reason: rejectionReason,
                    message: customMessage
                })
            });

            if (response.ok) {
                loadAdatok();
                toast.success("Poszt sikeresen elutasítva!");
                setRejectionReason('');
                setCustomMessage('');
                setShowRejectionModal(false);
            } else {
                const errorText = await response.text();
                toast.error("Hiba történt az elutasítás során: " + errorText);
            }
        } catch (error) {
            console.error("Hiba történt az elutasítás során:", error);
            toast.error("Hiba történt az elutasítás során: " + error.message);
        }
    };

    const filteredAnimals = adatok.filter(animal => {
        const matchesSearch = animal.allatfaj.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'approved') return matchesSearch && animal.approved;
        if (filter === 'pending') return matchesSearch && !animal.approved && !animal.rejected;
        if (filter === 'rejected') return matchesSearch && animal.rejected;
        return false;
    });

    const openModal = (animal) => {
        setSelectedAnimal(animal);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        loadAdatok();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-8">
                {/* Oldalsó menü */}
                <SideBarMenu 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    isAdmin={isAdmin} 
                />

                {/* Fő tartalom */}
                <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 md:p-8`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <h2 className={`text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#073F48]'} mb-4 md:mb-0`}>
                            <FaPaw className="w-6 h-6 mr-3 text-[#1A73E8]" />
                            Posztok kezelése
                        </h2>

                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Keresés mező */}
                            <div className="relative w-full md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Keresés..."
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 text-white border-gray-600 focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                            : 'bg-white text-[#073F48] border-gray-300 focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                    }`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Szűrő */}
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className={`w-full md:w-auto px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none ${
                                    theme === 'dark' 
                                        ? 'bg-gray-700 text-white border-gray-600 focus:ring-[#1A73E8] focus:border-[#1A73E8]' 
                                        : 'bg-white text-[#073F48] border-gray-300 focus:ring-[#1A73E8] focus:border-[#1A73E8]'
                                }`}
                            >
                                <option value="all">Összes</option>
                                <option value="approved">Jóváhagyottak</option>
                                <option value="pending">Jóváhagyásra várók</option>
                                <option value="rejected">Elutasítottak</option>
                            </select>
                        </div>
                    </div>

                    {/* Táblázat */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-left`}>
                                <tr>
                                    <th className="py-3 px-4 font-medium rounded-tl-lg">
                                        <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <FaPaw className="mr-2" />
                                            Faj
                                        </span>
                                    </th>
                                    <th className="py-3 px-4 font-medium">
                                        <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <FaPaw className="mr-2" />
                                            Kategória
                                        </span>
                                    </th>
                                    <th className="py-3 px-4 font-medium">
                                        <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <FaUserShield className="mr-2" />
                                            Státusz
                                        </span>
                                    </th>
                                    <th className="py-3 px-4 font-medium rounded-tr-lg text-right">
                                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Műveletek
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAnimals.map((animal) => (
                                    <tr key={animal.id} className={`border-b ${
                                        theme === 'dark' 
                                            ? 'border-gray-700 hover:bg-gray-700/80' 
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                                }`}>
                                                    <FaPaw className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                                                </div>
                                                <span className={`${theme === 'dark' ? 'text-white' : 'text-[#073F48]'}`}>
                                                    {animal.allatfaj}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`py-4 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {animal.kategoria || '-'}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                animal.elutasitva === "true"
                                                    ? theme === 'dark'
                                                        ? 'bg-red-900/30 text-red-400'
                                                        : 'bg-red-100 text-red-800'
                                                    : animal.elutasitva === "false"
                                                        ? theme === 'dark'
                                                            ? 'bg-green-900/30 text-green-400'
                                                            : 'bg-green-100 text-green-800'
                                                        : theme === 'dark'
                                                            ? 'bg-yellow-900/30 text-yellow-400'
                                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {animal.elutasitva === "true" 
                                                    ? "Elutasítva" 
                                                    : animal.elutasitva === "false" 
                                                        ? "Jóváhagyva" 
                                                        : "Jóváhagyásra vár"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end space-x-2">
                                                {animal.elutasitva === "" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveAnimal(animal.id)}
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                theme === 'dark'
                                                                    ? 'bg-green-900/20 hover:bg-green-900/30 text-green-400'
                                                                    : 'bg-green-100 hover:bg-green-200 text-green-600'
                                                            }`}
                                                            title="Jóváhagyás"
                                                        >
                                                            <FaCheck className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPostId(animal.id);
                                                                setShowRejectionModal(true);
                                                            }}
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                theme === 'dark'
                                                                    ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400'
                                                                    : 'bg-red-100 hover:bg-red-200 text-red-600'
                                                            }`}
                                                            title="Elutasítás"
                                                        >
                                                            <FaTimes className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteAnimal(animal.id)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        theme === 'dark'
                                                            ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400'
                                                            : 'bg-red-100 hover:bg-red-200 text-red-600'
                                                    }`}
                                                    title="Törlés"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openModal(animal)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        theme === 'dark'
                                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                                    }`}
                                                    title="Részletek"
                                                >
                                                    <FaInfoCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredAnimals.length === 0 && (
                            <div className={`py-12 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Nincs megjeleníthető poszt
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Details Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Állat részletes adatai"
                className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg p-6 w-11/12 max-w-4xl mx-auto mt-20 relative`}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
                {selectedAnimal && (
                    <div className="flex flex-col md:flex-row gap-6">
                        {selectedAnimal.filePath && (
                            <div className="flex justify-center md:justify-start">
                                <img
                                    src={`http://localhost:8000/${selectedAnimal.filePath}`}
                                    alt={selectedAnimal.allatfaj}
                                    className="w-48 h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-4">{selectedAnimal.allatfaj} adatai</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p><strong>Faj:</strong> {selectedAnimal.allatfaj}</p>
                                    <p><strong>Kategória:</strong> {selectedAnimal.kategoria || '-'}</p>
                                </div>
                                <div>
                                    <p><strong>Szín:</strong> {selectedAnimal.szin}</p>
                                    <p><strong>Méret:</strong> {selectedAnimal.meret}</p>
                                    <p><strong>Eltűnés helyszíne:</strong> {selectedAnimal.eltuneshelyszine}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p><strong>Egyéb információk:</strong> {selectedAnimal.egyeb_infok}</p>
                                <p><strong>Státusz:</strong> 
                                    {selectedAnimal.approved ? " Jóváhagyva" : 
                                     selectedAnimal.rejected ? " Elutasítva" : " Jóváhagyásra vár"}
                                </p>
                                {selectedAnimal.rejectionReasons?.length > 0 && (
                                    <div className={`mt-4 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-red-50"}`}>
                                        <h3 className="font-semibold mb-2">Elutasítási okok:</h3>
                                        <ul className="space-y-2">
                                            {selectedAnimal.rejectionReasons.map((reason, index) => (
                                                <li key={index} className="text-sm">
                                                    <p><strong>{reason.reason}</strong></p>
                                                    {reason.message && <p className="italic">{reason.message}</p>}
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(reason.date).toLocaleString()} - {reason.admin}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <button
                    className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        theme === "dark" 
                            ? "bg-gray-700 hover:bg-gray-600 text-white" 
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                    onClick={closeModal}
                >
                    <FaTimes className="inline-block mr-2" />
                    Bezárás
                </button>
            </Modal>

            {/* Rejection Modal */}
            <Modal
                isOpen={showRejectionModal}
                onRequestClose={() => setShowRejectionModal(false)}
                className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"} rounded-xl p-6 w-11/12 max-w-xl mx-auto mt-20 shadow-xl transform transition-all`}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)'
                    }
                }}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <FaCommentDots className="text-red-500" />
                            Poszt elutasítása
                        </h3>
                        <button
                            onClick={() => setShowRejectionModal(false)}
                            className={`p-2 rounded-lg transition-colors ${
                                theme === "dark"
                                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${
                                theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}>
                                Elutasítás oka
                            </label>
                            <select
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                                    theme === "dark" 
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]" 
                                        : "bg-white border-gray-300 text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]"
                                }`}
                            >
                                <option value="">Válassz okot...</option>
                                {predefinedReasons.map((reason, index) => (
                                    <option key={index} value={reason}>{reason}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${
                                theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}>
                                Egyéni üzenet (opcionális)
                            </label>
                            <textarea
                                placeholder="Adj meg további részleteket..."
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                                    theme === "dark" 
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-[#1A73E8] focus:border-[#1A73E8]" 
                                        : "bg-white border-gray-300 text-[#073F48] focus:ring-[#1A73E8] focus:border-[#1A73E8]"
                                }`}
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setShowRejectionModal(false)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                theme === "dark"
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                        >
                            <FaTimes className="inline-block mr-2" />
                            Mégse
                        </button>
                        <button
                            onClick={() => handleRejectAnimal(selectedPostId)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                theme === "dark"
                                    ? "bg-red-900/20 hover:bg-red-900/30 text-red-400"
                                    : "bg-red-100 hover:bg-red-200 text-red-600"
                            }`}
                            disabled={!rejectionReason}
                        >
                            <FaTimes className="inline-block mr-2" />
                            Elutasítás
                        </button>
                    </div>
                </div>
            </Modal>

            <ToastContainer position="bottom-right" theme={theme} />
        </div>
    );
};

export default AdminPanelPosts;