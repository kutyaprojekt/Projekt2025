import React from 'react';
import { useTheme } from "../../../context/ThemeContext";
import { FaPaw } from "react-icons/fa";

const UserPostsTemplate = ({animal}) => {
    const { theme } = useTheme();

    return (
        <div className={`h-full flex flex-col ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}>
            {/* Kép rész - fix magasság */}
            <div className="h-48 w-full overflow-hidden relative">
                {animal.filePath ? (
                    <img 
                        src={`http://localhost:8000/${animal.filePath}`} 
                        alt={animal.nev} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = '';
                        }}
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                        <FaPaw className={`text-4xl ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                    </div>
                )}
            </div>
            
            {/* Tartalom rész */}
            <div className="flex-grow p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>{animal.nev}</h2>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{animal.allatfaj}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        animal.visszakerult_e === "igen" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                    }`}>
                        {animal.visszakerult_e === "igen" ? "Megtalálva" : "Keresés alatt"}
                    </span>
                </div>

                <div className="flex-grow">
                    <div className={`grid grid-cols-2 gap-3 mb-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        <div>
                            <p><strong>Kategória:</strong> {animal.kategoria}</p>
                            <p><strong>Dátum:</strong> {animal.datum}</p>
                        </div>
                        <div>
                            <p><strong>Szín:</strong> {animal.szin}</p>
                            <p><strong>Helyszín:</strong> {animal.helyszin}</p>
                        </div>
                    </div>

                    {animal.egyeb_info && (
                        <div className={`mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} p-3 rounded-lg`}>
                            <p className="text-sm font-medium mb-1">Egyéb információk:</p>
                            <p className={`text-xs ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>{animal.egyeb_info}</p>
                        </div>
                    )}
                </div>

                {animal.visszakerult_e !== "igen" && (
                    <button 
                        className={`mt-auto w-full py-2 px-4 rounded-lg font-medium ${
                            theme === "dark" 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-green-500 hover:bg-green-600 text-white"
                        } transition duration-300`}
                        disabled // Jelenleg csak vizuális, nincs funkció hozzá
                    >
                        Megjelölés megtaláltként
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserPostsTemplate;