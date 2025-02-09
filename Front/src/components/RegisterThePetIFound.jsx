import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
const RegisterThePetIFound = () => {
    const { SetRefresh } = useContext(UserContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("usertoken");
  
    // Kezdeti állapot az állat adataihoz
    let formObj = {
      talaltvagyelveszett: "talalt",
      allatfaj: "",
      allatkategoria: "",
      mikorveszettel: "",
      allatneve: "",
      allatneme: "",
      allatszine: "",
      allatmerete: "",
      egyeb_infok: "",
      eltuneshelyszine: "",
      visszakerult_e: "",
      filePath: "",
    };
  
    const [formState, setFormState] = useState(formObj);
    const [file, setFile] = useState(null); // Fájl állapot definiálása
  
    // Input mezők változásának kezelése
    const writeData = (e) => {
      setFormState((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    };
  
    // Állat adatainak és fájljának elküldése a szerverre
    const regAnimal = async () => {
      if (!file) {
        alert("Kérjük, válassz ki egy fájlt!"); // Hibajelzés, ha nincs fájl kiválasztva
        return;
      }
  
      const formData = new FormData();
  
      // Állat adatainak hozzáadása a FormData-hoz
      for (const key in formState) {
        formData.append(key, formState[key]);
      }
  
      // Fájl hozzáadása a FormData-hoz
      formData.append("file", file);
  
      try {
        // Fájl és állat adatainak elküldése a szerverre
        const response = await fetch("http://localhost:8000/felhasznalok/talaltallat", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // FormData küldése
        });
  
        const data = await response.json();
  
        // Sikeres válasz kezelése
        if (data.message === "Sikeres adatfelvitel!") {
          alert("Sikeres adatfelvitel!");
          SetRefresh((prev) => !prev); // Frissítjük az állapotot
          navigate("/felhasznalok"); // Navigálás a felhasználók oldalra
        } else {
          alert(data.error); // Hiba esetén hibaüzenet
        }
      } catch (error) {
        console.error("Hiba történt az adatküldéskor:", error);
        alert("Hiba történt az adatküldéskor.");
      }
    };
  
    return (
      <div className="flex justify-center items-center flex-col gap-5">
        <h1 className="text-3xl font-bold">Allat cucc</h1>
        <div className="w-96 flex flex-col justify-center items-center gap-3">
          {/* Input mezők */}
          <label className="flex items-center gap-2 input input-bordered">
            <input
              id="allatfaj"
              type="text"
              className="grow"
              placeholder="Állatfaj"
              onChange={writeData}
            />
          </label>
  
          <label className="flex items-center gap-2 input input-bordered">
            <input
              id="allatkategoria"
              type="text"
              className="grow"
              placeholder="Állatkategória"
              onChange={writeData}
            />
          </label>
  
          <label className="flex items-center gap-2 input input-bordered">
            <input
              id="mikorveszettel"
              type="text"
              className="grow"
              placeholder="Eltűnés Időpontja"
              onChange={writeData}
            />
          </label>
  
          <label className="flex items-center gap-2 input input-bordered">
            <input
              id="allatneve"
              type="text"
              className="grow"
              placeholder="Kisállat Neve"
              onChange={writeData}
            />
          </label>
  
          <label className="flex items-center gap-2 input input-bordered">
            <input
              id="allatneme"
              type="text"
              className="grow"
              placeholder="Kisállat Neme"
              onChange={writeData}
            />
          </label>
  
          <label className="flex items-center gap-2 input input-bordered">
            <input
              id="allatszine"
              type="text"
              className="grow"
              placeholder="Kisállat Színe"
              onChange={writeData}
            />
          </label>
  
          <label className="flex items-center gap-2 input input-bordered">
            <input
              id="egyeb_infok"
              type="text"
              className="grow"
              placeholder="Egyéb Információk"
              onChange={writeData}
            />
          </label>
  
          <label className="flex items-center gap-2 input input-bordered">
            <input
              id="allatmerete"
              type="text"
              className="grow"
              placeholder="Állat mérete"
              onChange={writeData}
            />
          </label>
  
          <label className="flex items-center gap-2 input input-bordered">
            <input
              id="eltuneshelyszine"
              type="text"
              className="grow"
              placeholder="Eltűnés helyszíne"
              onChange={writeData}
            />
          </label>
  
          {/* Fájlfeltöltés */}
          <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
  
          {/* Adatfelvitel gomb */}
         
  <button
            onClick={() => {
              regAnimal();
            }}
            className="btn btn-primary"
          >
            Adatfelvitel
          </button>
        </div>
      </div>
    );
  };

export default RegisterThePetIFound
