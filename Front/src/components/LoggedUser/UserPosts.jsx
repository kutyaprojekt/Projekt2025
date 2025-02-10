import React from 'react'
const token = localStorage.getItem("usertoken"); // Token lekérése a localStorage-ból
import UserPostsTemplate from './UserPostsTemplate'
import { useEffect, useState, useContext } from "react"
const UserPosts = () => {

    const [animals, setAnimals] = useState([]);
    const loadAnimals = async () => {
            const response = await fetch("http://localhost:8000/felhasznalok/posztjaim", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                }
            });
            const data = await response.json();
            setAnimals(data);
            }
        
            useEffect(() => {
              loadAnimals()
          }, []);
  return (
    <div className="flex flex-col gap-5 pl-5">
         <h1 className="text-3xl font-bold justofy-center text-center mt-10">Posztjaim</h1>
         <div className="flex flex-wrap gap-5 justify-center items-center">
         {
             animals.map((animal) => (<UserPostsTemplate animal={animal}/>))
         }
     </div>
     </div>
  )
}

export default UserPosts
