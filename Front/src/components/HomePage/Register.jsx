import { useState, useEffect } from "react"; // useEffect importálása
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importáljuk a szemecske ikonokat

const Register = () => {
  const { SetRefresh } = useContext(UserContext);
  const navigate = useNavigate();

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
  }, []);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#63E2C6] to-[#5ABCB9]">
      <div className="bg-[#F0EDEE] p-10 rounded-3xl shadow-xl w-full max-w-2xl border-2 border-[#074F57]">
        <h1 className="text-4xl font-bold text-center text-[#074F57] mb-10">Regisztráció</h1>
        <div className="grid grid-cols-2 gap-6">
          {/* Email input with icon */}
          <div className="col-span-2">
            <label className="block text-xl font-medium text-[#074F57]">Email-cím</label>
            <div className="relative w-full">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="email"
                type="text"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholder="Email-cím"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Username input with icon */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Felhasználónév</label>
            <div className="relative w-full">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="username"
                type="text"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholder="Felhasználónév"
                onChange={writeData}
              />
            </div>
          </div>

          {/* Phone number input with icon */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Telefonszám</label>
            <div className="relative w-full">
              <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="phonenumber"
                type="number"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholder="Telefonszám"
                onChange={writeData}
                inputMode="numeric" // Csak numerikus billentyűzetet jelenít meg mobilon
              />
            </div>
          </div>

          {/* Password input with icon */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Jelszó</label>
            <div className="relative w-full">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="password"
                type={passwordVisible ? "text" : "password"} // Ha a jelszó látható, akkor "text" típus, egyébként "password"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholder="Jelszó"
                onChange={writeData}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash className="text-[#5ABCB9]" size={20} /> : <FaEye className="text-[#5ABCB9]" size={20} />}
              </span>
            </div>
          </div>

          {/* Password confirmation input */}
          <div className="col-span-1">
            <label className="block text-xl font-medium text-[#074F57]">Jelszó újra</label>
            <div className="relative w-full">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="password2"
                type={passwordVisible ? "text" : "password"}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg text-[#074F57]"
                placeholder="Jelszó újra"
                onChange={writeData}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash className="text-[#5ABCB9]" size={20} /> : <FaEye className="text-[#5ABCB9]" size={20} />}
              </span>
            </div>
          </div>

          {/* Submit button */}
          <div className="col-span-2">
            <button
              onClick={reguser}
              className="w-full bg-[#63E2C6] text-white py-3 px-5 rounded-lg hover:bg-[#5ABCB9] transition duration-300 text-xl font-semibold"
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