import React, { useState, useContext, useEffect } from "react"; // useEffect importálása
import UserContext from "../../context/UserContext";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';

/*  Weboldal színek
#63E2C6
#5ABCB9
#F0EDEE
#074F57
*/ 

const Login = () => {
  const { SetRefresh, getCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Az oldal tetejére görbülés a komponens betöltésekor
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      SetRefresh((prev) => !prev);
      navigate("/home");
    } else {
      toast(data.error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#63E2C6] to-[#5ABCB9]">
      <div className="bg-[#F0EDEE] p-10 rounded-3xl shadow-xl w-full max-w-lg border-2 border-[#074F57]">
        <h1 className="text-4xl font-bold text-center text-[#074F57] mb-10">Bejelentkezés</h1>
        <div className="space-y-6">
          <div className="relative flex flex-col">
            <label className="block text-xl font-medium text-[#074F57]">Felhasználónév</label>
            <div className="relative w-full">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                onChange={writeData}
                id="username"
                type="text"
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg"
                placeholder="Felhasználónév"
              />
            </div>
          </div>
          <div className="relative flex flex-col">
            <label className="block text-xl font-medium text-[#074F57]">Jelszó</label>
            <div className="relative w-full">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5ABCB9] text-xl" />
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#63E2C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ABCB9] text-lg"
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
          <div className="text-center mt-4">
            <p className="text-lg text-[#074F57]">
              Nincs még fiókod?{" "}
              <Link to="/regisztracio" className="text-[#63E2C6] font-semibold">
                Regisztráció
              </Link>
            </p>
          </div>
          <button onClick={login} className="w-full bg-[#63E2C6] text-white py-3 px-5 rounded-lg hover:bg-[#5ABCB9] transition duration-300 text-xl font-semibold">
            Bejelentkezés
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;