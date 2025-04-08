import React, { useEffect, useState, useContext } from 'react';
import MyProfileTemplate from './MyProfileTemplate';
import UserContext from '../../../context/UserContext';
import { useTheme } from '../../../context/ThemeContext';

const MyProfile = () => {
  const { user, refresh } = useContext(UserContext);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("usertoken");

  useEffect(() => {
    setLoading(false);
  }, [user, refresh]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
        <div className="text-2xl font-bold">Betöltés...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
        <div className="text-2xl font-bold text-red-500">Nem sikerült betölteni a profil adatokat.</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F0F4F8]'}`}>
      <MyProfileTemplate user={user} />
    </div>
  );
};

export default MyProfile;