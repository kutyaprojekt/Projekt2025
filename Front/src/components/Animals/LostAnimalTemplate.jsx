import React, { useState } from 'react';
import AnimalDetailsModal from './AnimalDetailsModal';
import { useTheme } from '../../context/ThemeContext'; // Téma kontextus importálása
import { FaPaw, FaClock, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa'; // Ikonok importálása

const LostAnimalTemplate = ({ animal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { theme } = useTheme(); // Téma állapot lekérése

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Dátum formázása
    const formatElapsedTime = (dateString) => {
        if (!dateString) {
            return "Ismeretlen dátum";
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Érvénytelen dátum";
        }

        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInHours / 24;

        if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} órája`;
        } else if (diffInDays < 7) {
            return `${Math.floor(diffInDays)} napja`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `${weeks} hete`;
        } else {
            const months = Math.floor(diffInDays / 30);
            return `${months} hónapja`;
        }
    };

    // Egyéb információk karakterlimitje
    const truncateText = (text, maxLength = 100) => {
        if (!text) return "Nincs";
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    return (
        <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-xl shadow-lg border-2 ${theme === "dark" ? "border-gray-700" : "border-blue-200"} max-w-sm mx-auto flex flex-col`}>
            {/* Kép rész - fix méret */}
            <figure className="w-full h-64 rounded-t-xl overflow-hidden">
                {animal.filePath && (
                    <img
                        src={`http://localhost:8000/${animal.filePath}`}
                        alt={animal.allatfaj}
                        className="w-full h-full object-cover"
                    />
                )}
            </figure>
            <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FaPaw className="text-yellow-500" />
                            {animal.allatfaj}
                        </h2>
                        <div className="badge badge-error">Elveszett</div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <FaClock className="text-gray-500" />
                        <div className="badge badge-warning">{formatElapsedTime(animal.datum)}</div>
                    </div>
                    {/* Egyéb információk fix magassággal és karakterlimittel */}
                    <div className="min-h-[100px]">
                        <div className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} p-4 rounded-xl shadow-md`}>
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <FaInfoCircle className="text-yellow-500" /> Egyéb információk:
                            </h3>
                            <p className={`${theme === "dark" ? "text-white" : "text-gray-600"} text-sm`}>
                                {truncateText(animal.egyeb_info)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="badge badge-outline">{animal.allatfaj}</div>
                    <button
                        className={`${theme === "dark" ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"} text-white btn btn-sm ml-auto`}
                        onClick={handleOpenModal}
                    >
                        <FaPaw className="mr-2" />
                        Megtekintés
                    </button>
                </div>
            </div>

            {/* Modal */}
            <AnimalDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                animal={animal}
            />
        </div>
    );
};

export default LostAnimalTemplate;