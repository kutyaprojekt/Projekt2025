import React, { useEffect, useState } from 'react';
import MyProfileTemplate from './MyProfileTemplate';

const MyProfile = () => {
  const [user, setUser] = useState(null); // Felhasználó adatainak tárolása
  const [loading, setLoading] = useState(true); // Betöltés állapota
  const token = localStorage.getItem("usertoken"); // Token lekérése

  // Profil adatok lekérése
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/felhasznalok/profilom', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Profil adatok lekérése sikertelen');
        }

        const data = await response.json();
        setUser(data); 
      } catch (error) {
        console.error('Hiba történt:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return <div>Betöltés...</div>; 
  }

  if (!user) {
    return <div>Nem sikerült betölteni a profil adatokat.</div>; // Hiba esetén
  }

  return (
    <div>
      <MyProfileTemplate user={user} />
    </div>
  );
};

export default MyProfile;