import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaImage, FaInfoCircle, FaVenusMars, FaRuler } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegisterMyLostPet = () => {
  const { SetRefresh } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("usertoken");

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
      mikorveszettel: date.toISOString().split("T")[0],
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#63E2C6] to-[#5ABCB9] p-4">
      {/* Bal oldal: Űrlap */}
      <div className="bg-[#F0EDEE] p-6 rounded-3xl shadow-xl w-full max-w-lg border-2 border-[#074F57]">
        <h1 className="text-3xl font-bold text-center text-[#074F57] mb-6">Elveszett állat adatai</h1>
        <div className="grid grid-cols-2 gap-4">
          {/* Állatfaj */}
          <div className="col-span-1">
            <label className="block text-lg font-medium text-[#074F57]">Állatfaj</label>
            <div className="relative w-full">
              <FaPaw className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-lg" />
              <input
                id="allatfaj"
                type="text"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57]"
                placeholder="Állatfaj"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Állatkategória */}
          <div className="col-span-1">
            <label className="block text-lg font-medium text-[#074F57]">Állatkategória</label>
            <div className="relative w-full">
              <FaPaw className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-lg" />
              <input
                id="allatkategoria"
                type="text"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57]"
                placeholder="Állatkategória"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Dátumválasztó */}
          <div className="col-span-1">
            <label className="block text-lg font-medium text-[#074F57]">Találat Időpontja</label>
            <div className="relative w-full">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="w-full pr-3 pl-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57]"
                placeholderText="Eltűnés Időpontja"
                dateFormat="yyyy.MM.dd"
              />
            </div>
          </div>

          {/* Kisállat Neve */}
          <div className="col-span-1">
            <label className="block text-lg font-medium text-[#074F57]">Kisállat Neve</label>
            <div className="relative w-full">
              <FaPaw className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-lg" />
              <input
                id="allatneve"
                type="text"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57]"
                placeholder="Kisállat Neve"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Kisállat Neme */}
          <div className="col-span-1">
            <label className="block text-lg font-medium text-[#074F57]">Kisállat Neme</label>
            <div className="relative w-full">
              <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-lg" />
              <input
                id="allatneme"
                type="text"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57]"
                placeholder="Kisállat Neme"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Kisállat Színe */}
          <div className="col-span-1">
            <label className="block text-lg font-medium text-[#074F57]">Kisállat Színe</label>
            <div className="relative w-full">
              <FaPaw className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-lg" />
              <input
                id="allatszine"
                type="text"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57]"
                placeholder="Kisállat Színe"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Kisállat Mérete */}
          <div className="col-span-1">
            <label className="block text-lg font-medium text-[#074F57]">Kisállat Mérete</label>
            <div className="relative w-full">
              <FaRuler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-lg" />
              <select
                id="allatmerete"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57]"
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
            <label className="block text-lg font-medium text-[#074F57]">Eltűnés Helyszíne</label>
            <div className="relative w-full">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-lg" />
              <input
                id="eltuneshelyszine"
                type="text"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57]"
                placeholder="Eltűnés Helyszíne"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Egyéb Információk */}
          <div className="col-span-2">
            <label className="block text-lg font-medium text-[#074F57]">Egyéb Információk (opcionális)</label>
            <div className="relative w-full">
              <FaInfoCircle className="absolute left-3 top-3 transform text-[#5ABCB9] text-lg" />
              <textarea
                id="egyeb_infok"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57] resize-none"
                placeholder="Egyéb Információk"
                onChange={writeData}
                rows={2}
              />
            </div>
          </div>

          {/* Kép feltöltése */}
          <div className="col-span-2">
            <label className="block text-lg font-medium text-[#074F57]">Kép feltöltése</label>
            <div className="relative w-full">
              <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-lg" />
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full pl-10 pr-3 py-2 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-base text-[#074F57]"
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
              className="w-full bg-[#63E2C6] text-white py-2 px-4 rounded-lg hover:bg-[#5ABCB9] transition duration-300 text-lg font-semibold"
            >
              Adatfelvitel
            </button>
            <ToastContainer />
          </div>
        </div>
      </div>

      {/* Jobb oldal: Kép és inspiráló szöveg */}
      <div className="hidden xl:flex flex-col justify-center items-center ml-8 w-1/3">
        <img
          src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          alt="Inspiráló kép"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold text-[#074F57] mb-4">Segítsünk Együtt!</h2>
          <p className="text-lg text-[#074F57]">
            Az elveszett állatok visszakerüléséhez szükségünk van a segítségedre. Töltsd ki az űrlapot, és segíts nekik hazatalálni!
          </p>
          <p className="text-lg text-[#074F57] mt-4">
            Több mint <strong>1,000,000</strong> állat került már vissza gazdájához azáltal, hogy közösségek összefogtak.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterMyLostPet;