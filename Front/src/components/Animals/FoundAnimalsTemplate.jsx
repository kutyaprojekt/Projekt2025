import React from 'react';

const FoundAnimalsTemplate = ({ animal }) => {
    return (
        <div className="card bg-white rounded-lg shadow-md overflow-hidden w-full max-w-xs mx-auto transform transition-transform duration-300 hover:scale-105">
            <div className="relative">
                {animal.filePath && (
                    <img 
                        src={`http://localhost:8000/${animal.filePath}`} 
                        alt={animal.nev} 
                        className="w-full h-48 object-cover object-top" 
                    />
                )}
                {/* Zöld pipa jel */}
                <div className="absolute top-2 left-2 bg-green-500 rounded-full p-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            </div>
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">{animal.nev}</h2>
            </div>
        </div>
    );
};

export default FoundAnimalsTemplate;