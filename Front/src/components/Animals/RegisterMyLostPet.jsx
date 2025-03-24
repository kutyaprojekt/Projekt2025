import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaImage, FaInfoCircle, FaVenusMars, FaRuler } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "../../context/ThemeContext";

const RegisterMyLostPet = () => {
  const { SetRefresh } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("usertoken");
  const { theme } = useTheme();

  let formObj = {
    talaltvagyelveszett: "",
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
  const [file, setFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Téma alkalmazása a body elemre
    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF] text-[#073F48]";
  }, [theme]);

  const writeData = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleDateChange = (date) => {
    const finalDate = date || new Date(); 
    setSelectedDate(finalDate);
    setFormState(prev => ({
      ...prev,
      mikorveszettel: finalDate.toISOString().split("T")[0]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
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
      const response = await fetch("http://localhost:8000/felhasznalok/elveszettallat", {
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
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Hiba történt az adatküldéskor:", error);
      toast.error("Hiba történt az adatküldéskor.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF]"} p-4`}>
      {/* Bal oldal: Űrlap */}
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-[#F0EDEE]"} p-6 rounded-3xl shadow-xl w-full max-w-lg border-2 ${theme === "dark" ? "border-gray-700" : "border-[#1A73E8]"}`}>
        <h1 className={`text-3xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Elveszett állat adatai</h1>
        <div className="grid grid-cols-2 gap-4">
          {/* Állatfaj */}
          <div className="col-span-1">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Állatfaj</label>
            <div className="relative w-full">
              <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg`} />
              <input
                id="allatfaj"
                type="text"
                className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base`}
                placeholder="Állatfaj"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Állatkategória */}
          <div className="col-span-1">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Állatkategória (opcionális)</label>
            <div className="relative w-full">
              <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg`} />
              <input
                id="allatkategoria"
                type="text"
                className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base`}
                placeholder="Állatkategória"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Dátumválasztó */}
          <div className="col-span-1">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Eltűnés Időpontja</label>
            <div className="relative w-full">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className={`w-full pl-3 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base`}
                placeholderText="Eltűnés Időpontja"
                dateFormat="yyyy.MM.dd"
                maxDate={new Date()}
              />
            </div>
          </div>

          {/* Kisállat Neve */}
          <div className="col-span-1">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kisállat Neve</label>
            <div className="relative w-full">
              <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg`} />
              <input
                id="allatneve"
                type="text"
                className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base`}
                placeholder="Kisállat Neve"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Kisállat Neme */}
          <div className="col-span-1">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kisállat Neme</label>
            <div className="relative w-full">
              <FaVenusMars className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg`} />
              <input
                id="allatneme"
                type="text"
                className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base`}
                placeholder="Kisállat Neme"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Kisállat Színe */}
          <div className="col-span-1">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kisállat Színe</label>
            <div className="relative w-full">
              <FaPaw className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg`} />
              <input
                id="allatszine"
                type="text"
                className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base`}
                placeholder="Kisállat Színe"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Kisállat Mérete */}
          <div className="col-span-1">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kisállat Mérete</label>
            <div className="relative w-full">
              <FaRuler className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg`} />
              <select
                id="allatmerete"
                className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base`}
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

          {/* Eltűnés Helyszíne */}
          <div className="col-span-1">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Eltűnés Helyszíne</label>
            <div className="relative w-full">
              <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg`} />
              <input
                id="eltuneshelyszine"
                type="text"
                className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base`}
                placeholder="Eltűnés Helyszíne"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Egyéb Információk */}
          <div className="col-span-2">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Egyéb Információk (opcionális)</label>
            <div className="relative w-full">
              <FaInfoCircle className={`absolute left-3 top-3 transform ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg`} />
              <textarea
                id="egyeb_infok"
                className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base resize-none`}
                placeholder="Egyéb Információk"
                onChange={writeData}
                rows={2}
              />
            </div>
          </div>

          {/* Kép feltöltése */}
          <div className="col-span-2">
            <label className={`block text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Kép feltöltése</label>
            <div className="relative w-full">
              <FaImage className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-lg`} />
              <input
                type="file"
                onChange={handleFileChange}
                className={`w-full pl-10 pr-3 py-2 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-base`}
                accept="image/*"
              />
            </div>
            {preview && (
              <div className="mt-4 flex justify-center">
                <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Adatfelvitel gomb */}
          <div className="col-span-2">
            <button
              onClick={regAnimal}
              className={`w-full ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#1A73E8] hover:bg-[#1557B0]"} text-white py-2 px-4 rounded-lg transition duration-300 text-lg font-semibold`}
            >
              Adatfelvitel
            </button>
            <ToastContainer />
          </div>
        </div>
      </div>

      {/* Jobb oldal: Kép és inspiráló szöveg */}
      <div className="hidden xl:flex flex-col justify-center items-center ml-8 w-1/3">
        <div className="mt-6 text-center p-8 bg-opacity-20  ">
          <h2 className={`text-4xl font-bold ${theme === "dark" ? "text-white" : "text-[#074F57]"} mb-6`}>
            Együtt segíthetünk hazatalálni!
          </h2>
          <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-[#074F57]"} mb-6 leading-relaxed`}>
            Minden nap rengeteg kisállat téved el, és egy pillanat alatt elveszíthetjük őket. Az elveszett házikedvencek minden egyes gazdája szívében ott az aggodalom, és a vágy, hogy újra együtt lehessenek kedvencükkel. <span className={`${theme === "dark" ? "text-gray-200" : "text-[#074F57]"} font-semibold`}>Éppen ezért létfontosságú, hogy összefogjunk, és segítsük őket visszatalálni.</span>
          </p>
          <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-[#074F57]"} mb-6 leading-relaxed`}>
            Az ilyen esetekben az emberek közössége az, ami igazán számít. A közösségi összefogás, az összegyűjtött információk és az egymásra figyelés segíthet gyorsabban és biztonságosabban visszajuttatni az állatokat otthonukba. Mi mindannyian egy nagy család vagyunk, és <span className={`${theme === "dark" ? "text-gray-200" : "text-[#074F57]"} font-semibold`}>együtt erősebbek vagyunk.</span>
          </p>
          <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-[#074F57]"} mb-6 leading-relaxed`}>
            Az elmúlt években több mint <strong className={`${theme === "dark" ? "text-gray-200" : "text-[#074F57]"} font-semibold`}>1,000,000</strong> elveszett állat talált már hazára, köszönhetően az olyan embereknek, mint Te. Egy egyszerű megosztás, egy segítő kéz, vagy egy kis figyelmesség mind hozzájárulhat ahhoz, hogy egy kis kedvenc végre hazatérhessen.
          </p>
          <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-[#074F57]"} mb-6 leading-relaxed`}>
            Tarts velünk ebben a nemes célban! Ne hagyjuk, hogy egyetlen házikedvenc se veszítse el reményét, és ne hagyjuk, hogy egy gazda szíve sokáig üresen maradjon. Ha teheted, <span className={`${theme === "dark" ? "text-gray-200" : "text-[#074F57]"} font-semibold`}>töltsd ki az űrlapot, és segíts abban, hogy ezek a történetek végül boldog befejezést nyerjenek!</span>
          </p>
        </div>
      </div>


    </div>
  );
};

export default RegisterMyLostPet;