import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaImage, FaInfoCircle, FaVenusMars, FaRuler } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RegisterThePetIFound = () => {
  const { SetRefresh } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("usertoken");

  let formObj = {
    talaltvagyelveszett: "talalt",
    allatfaj: "",
    allatkategoria: "",
    mikorveszettel: "",
    allatszine: "",
    allatmerete: "",
    egyeb_infok: "",
    eltuneshelyszine: "",
    visszakerult_e: "",
    filePath: "",
  };

  const [formState, setFormState] = useState(formObj);
  const [file, setFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [preview, setPreview] = useState(null); // Új állapot a kép előnézetének

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const writeData = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormState((prevState) => ({
      ...prevState,
      mikorveszettel: date.toISOString().split('T')[0],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Kép előnézetének beállítása
      };
      reader.readAsDataURL(file);
    }
  };

  const regAnimal = async () => {
    if (!file) {
      toast.error("Kérjük, válassz ki egy képet!");
      return;
    }

    const formData = new FormData();

    for (const key in formState) {
      formData.append(key, formState[key]);
    }

    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/felhasznalok/talaltallat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.message === "Sikeres adatfelvitel!") {
        toast.success("Sikeres adatfelvitel!");
        SetRefresh((prev) => !prev);
      
        // 5 másodperc várakozás után átirányítás
        //setTimeout(() => {
        //  navigate("/home");
        //}, 1200); // 1000 ms = 1 másodperc
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Hiba történt az adatküldéskor:", error);
      toast.error("Hiba történt az adatküldéskor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#63E2C6] to-[#5ABCB9]">
      <div className="bg-[#F0EDEE] p-10 rounded-3xl shadow-xl w-full max-w-2xl border-2 border-[#074F57]">
        <h1 className="text-4xl font-bold text-center text-[#074F57] mb-10">Megtalált állat adatai</h1>
        <div className="grid grid-cols-2 gap-6">
          {/* Állatfaj */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Állatfaj</label>
            <div className="relative w-full">
              <FaPaw className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="allatfaj"
                type="text"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholder="Állatfaj"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Állatkategória */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Állatkategória (opcionális)</label>
            <div className="relative w-full">
              <FaPaw className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="allatkategoria"
                type="text"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholder="Állatkategória"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Dátumválasztó */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Találat Időpontja</label>
            <div className="relative w-full">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="w-full pr-4 pl-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholderText="Eltűnés Időpontja"
                dateFormat="yyyy.MM.dd"
              />
            </div>
          </div>

          {/* Kisállat Színe */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Kisállat Színe</label>
            <div className="relative w-full">
              <FaPaw className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="allatszine"
                type="text"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholder="Kisállat Színe"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Kisállat Mérete */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Kisállat Mérete</label>
            <div className="relative w-full">
              <FaRuler className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <select
                id="allatmerete"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                onChange={writeData}
                value={formState.allatmerete}
              >
                <option value="">Válassz méretet</option>
                <option value="kicsi">Kicsi</option>
                <option value="közepes">Közepes</option>
                <option value="nagy">Nagy</option>
              </select>
            </div>
          </div>

          {/* Találat Helyszíne */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Találat Helyszíne</label>
            <div className="relative w-full">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="eltuneshelyszine"
                type="text"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholder="Találat Helyszíne"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Egyéb Információk */}
          <div className="col-span-2">
            <label className="block text-xl font-medium text-[#074F57]">Egyéb Információk (opcionális)</label>
            <div className="relative w-full">
              <FaInfoCircle className="absolute left-4 top-4 transform text-[#5ABCB9] text-xl" />
              <textarea
                id="egyeb_infok"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57] resize-none"
                placeholder="Egyéb Információk"
                onChange={writeData}
                rows={2}
              />
            </div>
          </div>

          {/* Kép feltöltése */}
          <div className="col-span-2">
            <label className="block text-xl font-medium text-[#074F57]">Kép feltöltése</label>
            <div className="relative w-full">
              <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                type="file"
                onChange={handleFileChange} // Módosított függvény
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                accept="image/*"
              />
            </div>
            {preview && ( // Kép előnézetének megjelenítése
              <div className="mt-4 flex justify-center">
                <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Adatfelvitel gomb */}
          <div className="col-span-2">
            <button
              onClick={regAnimal}
              className="w-full bg-[#63E2C6] text-white py-3 px-5 rounded-lg hover:bg-[#5ABCB9] transition duration-300 text-xl font-semibold"
            >
              Adatfelvitel
            </button>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterThePetIFound;