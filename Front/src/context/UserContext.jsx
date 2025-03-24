import { useState, createContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [refresh, SetRefresh] = useState(false);
    const [user, setUser] = useState({});
    const token = localStorage.getItem('usertoken');

    // Lekérem a felhasználót
    const getCurrentUser = async (token) => {
        const response = await fetch('http://localhost:8000/felhasznalok/me', {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        setUser(data); // Frissíti a felhasználói adatokat
    };

    // Mindig lefut, amikor betölt a komponens
    // Oldal reload esetén is le fog futni
    useEffect(() => {
        if (token) {
            getCurrentUser(token);
        }
    }, [refresh]); // A refresh változására is reagál

    return (
        <UserContext.Provider value={{
            refresh,
            SetRefresh,
            user,
            setUser, // Hozzáadva a setUser függvény
            getCurrentUser
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;