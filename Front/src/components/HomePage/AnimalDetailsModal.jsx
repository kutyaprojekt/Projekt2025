import React from 'react';

const AnimalDetailsModal = ({ animal, onClose }) => {
    return (
        <dialog id="animal-details-modal" className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-4">Elveszett kisállat adatai</h3>
                
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-200 flex items-center justify-center">
                        {animal.filePath && (
                            <img 
                                src={`http://localhost:8000/${animal.filePath}`} 
                                alt={animal.nev} 
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                <p><strong>Helyszín:</strong> {animal.helyszin}</p>
                
                <div className="space-y-4">
                    <p><strong>Faj:</strong> {animal.allatfaj}</p>
                    <p><strong>Kategória:</strong> {animal.kategoria}</p>
                    <p><strong>Dátum:</strong> {animal.datum}</p>
                    <p><strong>Nem:</strong> {animal.neme}</p>
                    <p><strong>Szín:</strong> {animal.szin}</p>
                    <p><strong>Méret:</strong> {animal.meret}</p>
                    <p><strong>Egyéb információk:</strong> {animal.egyeb_info}</p>
                   
                    {animal.user && (
                        <div className="mt-4">
                            <h4 className="text-lg font-bold">Tulajdonos adatai:</h4>
                            <p><strong>Név:</strong> {animal.user.username}</p>
                            <p><strong>Email:</strong> {animal.user.email}</p>
                            <p><strong>Telefonszám:</strong> {animal.user.phonenumber}</p>
                        </div>
                    )}
                </div>
                <div className="modal-action">
                    <button className="btn btn-primary" onClick={onClose}>Bezárás</button>
                </div>
            </div>
        </dialog>
    );
};

export default AnimalDetailsModal;