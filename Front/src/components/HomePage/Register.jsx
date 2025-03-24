import { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTheme } from "../../context/ThemeContext"; // Importáljuk a useTheme hookot

const Register = () => {
  const { SetRefresh } = useContext(UserContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Téma állapot és váltó függvény

  let formObj = {
    username: "",
    password: "",
    password2: "",
    email: "",
    phonenumber: "",
  };

  const [formState, setFormState] = useState(formObj);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Az oldal tetejére görbülés a komponens betöltésekor
  useEffect(() => {
    window.scrollTo(0, 0);
    // Téma alkalmazása a body elemre
    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF] text-[#073F48]";
  }, [theme]);

  const writeData = (e) => {
    const { id, value } = e.target;

    // Csak számokat engedélyez a telefonszám mezőben
    if (id === "phonenumber") {
      if (!/^\d*$/.test(value)) {
        return; // Ha nem szám, nem frissítjük az állapotot
      }
    }

    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const reguser = async () => {
    const response = await fetch("http://localhost:8000/felhasznalok/regisztracio", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formState),
    });

    const data = await response.json();
    console.log(data);
    if (data.message === "Sikeres regisztráció!") {
      toast(data.message);
      SetRefresh((prev) => !prev);
      navigate("/login");
    } else {
      toast(data.error);
    }
  };

  // Jelszó láthatóságának váltása
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF]"} p-4`}>
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-3xl shadow-xl w-full max-w-2xl border-2 ${theme === "dark" ? "border-gray-700" : "border-[#1A73E8]"}`}>
        <h1 className={`text-4xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-10`}>Regisztráció</h1>
        <div className="grid grid-cols-2 gap-6">
          {/* Email input with icon */}
          <div className="col-span-2">
            <label className={`block text-xl font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Email-cím</label>
            <div className="relative w-full">
              <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-xl`} />
              <input
                id="email"
                type="text"
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-lg`}
                placeholder="Email-cím"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Username input with icon */}
          <div className="col-span-1">
            <label className={`block text-xl font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Felhasználónév</label>
            <div className="relative w-full">
              <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-xl`} />
              <input
                id="username"
                type="text"
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-lg`}
                placeholder="Felhasználónév"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Phone number input with icon */}
          <div className="col-span-1">
            <label className={`block text-xl font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Telefonszám</label>
            <div className="relative w-full">
              <FaPhone className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-xl`} />
              <input
                id="phonenumber"
                type="number"
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-lg`}
                placeholder="Telefonszám"
                onChange={writeData}
                inputMode="numeric" // Csak numerikus billentyűzetet jelenít meg mobilon
              />
            </div>
          </div>

          {/* Password input with icon */}
          <div className="col-span-1">
            <label className={`block text-xl font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Jelszó</label>
            <div className="relative w-full">
              <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-xl`} />
              <input
                id="password"
                type={passwordVisible ? "text" : "password"} // Ha a jelszó látható, akkor "text" típus, egyébként "password"
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-lg`}
                placeholder="Jelszó"
                onChange={writeData}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash className={`${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"}`} size={20} /> : <FaEye className={`${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"}`} size={20} />}
              </span>
            </div>
          </div>

          {/* Password confirmation input */}
          <div className="col-span-1">
            <label className={`block text-xl font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Jelszó újra</label>
            <div className="relative w-full">
              <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-xl`} />
              <input
                id="password2"
                type={passwordVisible ? "text" : "password"}
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-lg`}
                placeholder="Jelszó újra"
                onChange={writeData}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash className={`${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"}`} size={20} /> : <FaEye className={`${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"}`} size={20} />}
              </span>
            </div>
          </div>

          {/* Submit button */}
          <div className="col-span-2">
            <button
              onClick={reguser}
              className={`w-full ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#1A73E8] hover:bg-[#1557B0]"} text-white py-3 px-5 rounded-lg transition duration-300 text-xl font-semibold`}
            >
              Regisztráció
            </button>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;