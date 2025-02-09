import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import UserList from "./components/UserList";

import MyProfile from "./components/MyProfile";
import RegisterThePetIFound from "./components/RegisterThePetIFound";
import RegisterMyLostPet from "./components/RegisterMyLostPet";
import AnimalListed from "./components/AnimalListed";
import AdminPanelPosts from "./components/AdminPanelPosts";
import AdminPanelUsers from "./components/AdminPanelUsers";

import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
// http://localhost:8000/felhasznalok/regisztracio
// http://localhost:8000/felhasznalok/login
// http://localhost:8000/felhasznalok/alluser

function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path={"/login"} element={<Login />} />
            <Route path={"/regisztracio"} element={<Register />} />
            <Route path={"/felhasznalok"} element={<UserList />} />
            <Route path={"/elveszettallat"} element={<RegisterMyLostPet />} />
            <Route path={"/talaltallat"} element={<RegisterThePetIFound />} />  
            <Route path={"/osszallat"} element={<AnimalListed />} />
            <Route path={"/profilom"} element={<MyProfile />} />    
            <Route path={"/adminusers"} element={<AdminPanelUsers />} />  
            <Route path={"/adminposts"} element={<AdminPanelPosts />} />          
          </Routes>
        </Router>
        <ToastContainer />
      </UserProvider>
    </>
  );
}

export default App;
