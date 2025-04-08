import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaVenusMars } from 'react-icons/fa';

const AnimalDetailsModal = ({ animal, onClose }) => {
    const { theme } = useTheme();
    const cardBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
    const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Bal oldal: Kép */}
                        <div className="w-full md:w-1/3">
                            <div className="rounded-xl overflow-hidden shadow-lg h-64 md:h-full">
                                {animal.filePath && (
                                    <img
                                        src={`http://localhost:8000/${animal.filePath}`}
                                        alt={animal.allatfaj}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Jobb oldal: Információk */}
                        <div className="w-full md:w-2/3 flex flex-col gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold flex items-center gap-2">
                                    <FaPaw className="text-yellow-500" /> {animal.allatfaj}
                                </h2>
                                <p className={`${textSecondary} text-lg`}>
                                    {animal.allatfaj}
                                    {animal.kategoria && ` - ${animal.kategoria}`}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`${cardBg} p-5 rounded-xl shadow-md flex items-center gap-3`}>
                                    <FaCalendarAlt className="text-2xl text-blue-500" />
                                    <div>
                                        <p className="font-semibold">Eltűnés dátuma</p>
                                        <p>{animal.datum}</p>
                                    </div>
                                </div>

                                <div className={`${cardBg} p-5 rounded-xl shadow-md flex items-center gap-3`}>
                                    <FaMapMarkerAlt className="text-2xl text-red-500" />
                                    <div>
                                        <p className="font-semibold">Helyszín</p>
                                        <p>{animal.eltuneshelyszine}</p>
                                    </div>
                                </div>

                                {animal.allatneme && (
                                    <div className={`${cardBg} p-5 rounded-xl shadow-md flex items-center gap-3`}>
                                        <FaVenusMars className="text-2xl text-pink-500" />
                                        <div>
                                            <p className="font-semibold">Nem</p>
                                            <p>{animal.allatneme}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {animal.egyeb_info && (
                                <div className={`${cardBg} p-5 rounded-xl shadow-md`}>
                                    <h3 className="font-semibold mb-2">Egyéb információk</h3>
                                    <p className={textSecondary}>{animal.egyeb_info}</p>
                                </div>
                            )}

                            {animal.user && (
                                <div className={`${cardBg} p-5 rounded-xl shadow-md`}>
                                    <h3 className="font-semibold mb-3">Kapcsolat</h3>
                                    <div className="space-y-2">
                                        <p><strong>Név:</strong> {animal.user.username}</p>
                                        <p><strong>Email:</strong> {animal.user.email}</p>
                                        <p><strong>Telefonszám:</strong> {animal.user.phonenumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"} text-white px-6 py-2 rounded-lg transition duration-300`}
                        >
                            Bezárás
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimalDetailsModal;