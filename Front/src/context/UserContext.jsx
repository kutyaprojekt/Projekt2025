import { useState,createContext, useEffect } from "react";

const UserContext=createContext();

export const UserProvider=({children})=>{

    const [refresh, SetRefresh] = useState(false)
    const [user, setUser] = useState({})
    const token = localStorage.getItem('usertoken')

    //lekérem a felhasználót

    const getCurrentUser = async (token) => {
        const response = await fetch('http://localhost:8000/felhasznalok/me', {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`

            }
        })
        const data = await response.json()
        setUser(data)
    }

    // mindig lefut amikor betölt a komponens
    // oldal reload esetén is le fog futni
    useEffect (() => {
        if (token) {
            getCurrentUser(token)
        }
    }, [])



    return<UserContext.Provider value={{
        refresh,
        SetRefresh,
        user,
        getCurrentUser
    }}>{children}</UserContext.Provider>
}

export default UserContext;