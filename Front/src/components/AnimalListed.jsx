import LostAnimalTemplate from "./LostAnimalTemplate";
import React from 'react'
import { useEffect, useState, useContext } from "react"

const AnimalListed = () => {

    const [animals, setAnimals] = useState([]);
    
      const loadAnimals = async () => {
        const response = await fetch("http://localhost:8000/felhasznalok/osszallat", {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
    
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
         <h1 className="text-3xl font-bold justofy-center text-center mt-10">Összes Állat</h1>
         <div className="flex flex-wrap gap-5 justify-center items-center">
         {
             animals.map((animal) => (<LostAnimalTemplate animal={animal}/>))
         }
     </div>
     </div>
     
 )}

export default AnimalListed
