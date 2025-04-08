import React, { useState } from 'react';
import AnimalDetailsModal from './AnimalDetailsModal';
import { useTheme } from '../../context/ThemeContext';
import { FaPaw, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const LostAnimalTemplate = ({ animal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { theme } = useTheme();

    const handleOpenModal = (e) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    const handleCloseModal = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setIsModalOpen(false);
    };

    // Dátum formázása
    const formatElapsedTime = (dateString) => {
        if (!dateString) return "Ismeretlen dátum";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Érvénytelen dátum";

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

    return (
        <div className="w-72" onClick={(e) => e.stopPropagation()}>
            {/* Kép rész */}
            <div className="relative h-48 overflow-hidden rounded-t-xl">
                <img
                    src={animal.filePath ? `http://localhost:8000/${animal.filePath}` : "https://via.placeholder.com/300x200"}
                    alt={animal.allatfaj}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                    <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${theme === "dark" ? "bg-red-600" : "bg-red-500"} text-white
                    `}>
                        Elveszett
                    </span>
                </div>
            </div>

            {/* Tartalom */}
            <div className="p-4">
                {/* Faj és helyszín */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <FaPaw className={theme === "dark" ? "text-blue-400" : "text-blue-500"} />
                            {animal.allatfaj}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            {animal.helyszin}
                        </span>
                    </div>
                </div>

                {/* Idő */}
                <div className="flex items-center gap-2 mb-4">
                    <FaClock className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
                    <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        {formatElapsedTime(animal.datum)}
                    </span>
                </div>

                {/* Gomb */}
                <button
                    onClick={handleOpenModal}
                    className={`
                        w-full py-2 px-4 rounded-lg
                        flex items-center justify-center gap-2
                        transition duration-300
                        ${theme === "dark" 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }
                    `}
                >
                    <FaPaw />
                    Részletek
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <AnimalDetailsModal
                    animal={animal}
                    onClose={handleCloseModal}
                    isOpen={isModalOpen}
                />
            )}
        </div>
    );
};

export default LostAnimalTemplate;