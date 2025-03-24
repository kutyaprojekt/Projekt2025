import React, { useState, useContext, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from "../../context/ThemeContext"; // Importáljuk a useTheme hookot

const Login = () => {
  const { SetRefresh, getCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Téma állapot és váltó függvény

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Az oldal tetejére görbülés a komponens betöltésekor
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

  const login = async () => {
    const response = await fetch("http://localhost:8000/felhasznalok/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formState),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("usertoken", data.token);
      getCurrentUser(data.token);
      SetRefresh((prev) => !prev); // Frissítjük a felhasználói állapotot
      navigate("/home");
      window.location.reload(); // Explicit oldal frissítés
    } else {
      toast(data.error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF]"} p-4`}>
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-3xl shadow-xl w-full max-w-lg border-2 ${theme === "dark" ? "border-gray-700" : "border-[#1A73E8]"}`}>
        <h1 className={`text-4xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-10`}>Bejelentkezés</h1>
        <div className="space-y-6">
          <div className="relative flex flex-col">
            <label className={`block text-xl font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Felhasználónév</label>
            <div className="relative w-full">
              <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-xl`} />
              <input
                onChange={writeData}
                id="username"
                type="text"
                className={`w-full pl-12 pr-4 py-3 border-2 ${theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-[#1A73E8] bg-white text-[#073F48]"} rounded-lg focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-gray-500" : "focus:ring-[#1A73E8]"} text-lg`}
                placeholder="Felhasználónév"
              />
            </div>
          </div>
          <div className="relative flex flex-col">
            <label className={`block text-xl font-medium ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Jelszó</label>
            <div className="relative w-full">
              <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-[#1A73E8]"} text-xl`} />
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
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
          <div className="text-center mt-4">
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-[#073F48]"}`}>
              Nincs még fiókod?{" "}
              <Link to="/regisztracio" className={`${theme === "dark" ? "text-[#1A73E8]" : "text-[#1A73E8]"} font-semibold`}>
                Regisztráció
              </Link>
            </p>
          </div>
          <button
            onClick={login}
            className={`w-full ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#1A73E8] hover:bg-[#1557B0]"} text-white py-3 px-5 rounded-lg transition duration-300 text-xl font-semibold`}
          >
            Bejelentkezés
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;