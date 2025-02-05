import React from "react";
import { useState } from "react";
import UserContext from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const{SetRefresh, getCurrentUser} = useContext(UserContext);
  const navigate = useNavigate()


  let formObj = {
    email: "",
    password: "",
    username:""
  };

  const [formState, setFormState] = useState(formObj);

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
    if(data.token){
      localStorage.setItem("usertoken", data.token);
      getCurrentUser(data.token)
      SetRefresh(prev => !prev);
      navigate("/felhasznalok")
    }
    else{
      
      alert(data.error);
    }

    console.log(data);
 
  };

  return (
    <div className="flex justify-center items-center flex-col gap-5">
      <h1 className="text-3xl font-bold">Bejelentkezés</h1>
      <div className="w-96 flex flex-col justify-center items-center gap-3">
        <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input onChange={writeData} id="username" type="text" className="grow" placeholder="username" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input id="password" type="password" className="grow" placeholder="Password" onChange={writeData} />
        </label>
        <button
          onClick={() => {
            login();
          }}
          className="btn btn-primary"
        >
          Bejelentkezés
        </button>
      </div>
    </div>
  );
};

export default Login;
