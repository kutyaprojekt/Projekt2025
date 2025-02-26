import React, { useState } from 'react';
import AnimalDetailsModal from './AnimalDetailsModal';

const LostAnimalTemplate = ({ animal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-64 text-center flex flex-col items-center border-2 border-blue-100">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-200">
                {animal.filePath && (
                    <img 
                        src={`http://localhost:8000/${animal.filePath}`} 
                        alt={animal.nev} 
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            
            <p className="text-xl font-bold mb-2">{animal.allatfaj}</p>
            <h2 className="mb-4">Egyéb: {animal.egyeb_info}</h2>
            <button 
                onClick={handleOpenModal} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Megtekintés
            </button>

            {isModalOpen && (
                <AnimalDetailsModal 
                    animal={animal} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
};

export default LostAnimalTemplate;