import React from 'react'


const UserPostsTemplate = ({animal}) => {
    return (
        <div className="shadow-xl card bg-base-100 w-96">
            <div className="card-body">
                <h2 className="text-xl font-bold">{animal.nev}</h2>
                <p><strong>Faj:</strong> {animal.allatfaj}</p>
                <p><strong>Kategória:</strong> {animal.kategoria}</p>
                <p><strong>Dátum:</strong> {animal.datum}</p>
                <p><strong>Nem:</strong> {animal.neme}</p>
                <p><strong>Szín:</strong> {animal.szin}</p>
                <p><strong>Méret:</strong> {animal.meret}</p>
                <p><strong>Egyéb információk:</strong> {animal.egyeb_info}</p>
                <p><strong>Helyszín:</strong> {animal.helyszin}</p>
                <p><strong>Visszakerült-e:</strong> {animal.visszakerult_e}</p>
                {animal.filePath && <img src={`http://localhost:8000/${animal.filePath}`} alt={animal.nev} className="object-cover w-32 h-32 mt-2" />}
                <p><strong>Tulaj:</strong></p>
                {animal.user && (
                    <div>
                        <p><strong>Név:</strong> {animal.user.username}</p>
                        <p><strong>Email:</strong> {animal.user.email}</p>
                        <p><strong>Telefonszáms:</strong> {animal.user.phonenumber}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default UserPostsTemplate
