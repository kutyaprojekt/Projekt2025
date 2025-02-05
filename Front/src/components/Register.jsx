import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

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

  const writeData = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
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
    console.log(data)
    // Ellenőrizzük, hogy a regisztráció sikeres volt-e
    if (data.message === "Sikeres regisztráció!") {
      alert(data.message);
      SetRefresh((prev) => !prev); // Frissítjük az állapotot
      navigate("/login"); // Navigálunk a bejelentkezési oldalra
    }
    else{
      alert("error "+ data.error)
    }

    

  };

  return (
    <div className="flex justify-center items-center flex-col gap-5">
      <h1 className="text-3xl font-bold">Regisztráció</h1>
      <div className="w-96 flex flex-col justify-center items-center gap-3">
    
        <label className="flex items-center gap-2 input input-bordered">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446 .1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0  0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            id="email"
            type="text"
            className="grow"
            placeholder="Email-cím"
            onChange={writeData} />
        </label>

        <label className="flex items-center gap-2 input input-bordered">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            id="username"
            type="text"
            className="grow"
            placeholder="Felhasználónév"
            onChange={writeData} />
        </label>

        <label className="flex items-center gap-2 input input-bordered">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
          </svg>
          <input
            id="password"
            type="password"
            className="grow"
            placeholder="Jelszó"
            onChange={writeData} />
        </label>

        <label className="flex items-center gap-2 input input-bordered">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
          </svg>
          <input
            id="password2"
            type="password"
            className="grow"
            placeholder="Jelszó Újra"
            onChange={writeData} />
        </label>


        <label className="flex items-center gap-2 input input-bordered">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-4 opacity-75">
            <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
          </svg>
          <input
            id="phonenumber"
            type="number"
            className="grow"
            placeholder="Telefonszám"
            onChange={writeData}
          />
        </label>
        <button
          onClick={() => {
            reguser();
          }}
          className="btn btn-primary"
        >
          Regisztráció
        </button>
      </div>
    </div>
  );
};

export default Register;
