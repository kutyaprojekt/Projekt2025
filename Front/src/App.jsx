import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext"; // Importáljuk a ThemeProvider-t
import Navbar from "./components/Assets/Navbar";
import Footer from "./components/Assets/FooterComponents/Footer";
import Home from "./components/HomePage/HomePage";
import Login from "./components/HomePage/Login";
import Register from "./components/HomePage/Register";
import RegisterMyLostPet from "./components/Animals/RegisterMyLostPet";
import RegisterThePetIFound from "./components/Animals/RegisterThePetIFound";
import LostAnimals from "./components/Animals/LostAnimals";
import FoundAnimals from "./components/Animals/FoundAnimals";
import MyProfile from "./components/LoggedUser/Profile/MyProfile";
import AdminPanelPosts from "./components/Admin/AdminPanelPosts"; 
import AdminPanelUsers from "./components/Admin/AdminPanelUsers";
import UserPosts from "./components/LoggedUser/Profile/UserPosts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserList from "./components/UserList";
import AboutUs from "./components/Assets/FooterComponents/AboutUs";
import HowItWorks from "./components/Assets/FooterComponents/HowItWorks";
import GYIK from "./components/Assets/FooterComponents/GYIK";
import ContactUs from "./components/Assets/FooterComponents/ContactUs";
import UserMessages from "./components/LoggedUser/Profile/UserMessages";


// http://localhost:8000/felhasznalok/regisztracio
// http://localhost:8000/felhasznalok/login
// http://localhost:8000/felhasznalok/alluser

function App() {
  return (
    <>
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Navbar />
          <Routes>
          <Route path={"*"} element={<Home />} />
            <Route path={"/"} element={<Home />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/regisztracio"} element={<Register />} />
            <Route path={"/felhasznalok"} element={<UserList />} />
            <Route path={"/elveszettallat"} element={<RegisterMyLostPet />} />
            <Route path={"/talaltallat"} element={<RegisterThePetIFound />} />  
            <Route path={"/osszallat"} element={<LostAnimals />} />
            <Route path={"/profilom"} element={<MyProfile />} />    
            <Route path={"/adminusers"} element={<AdminPanelUsers />} />  
            <Route path={"/adminposts"} element={<AdminPanelPosts />} />         
            <Route path={"/megtalaltallatok"} element={<FoundAnimals />} /> 
            <Route path={"/posztjaim"} element={<UserPosts />} />
            <Route path={"/aboutus"} element={<AboutUs />} />
            <Route path={"/howitworks"} element={<HowItWorks />} />
            <Route path={"/gyik"} element={<GYIK />} /> 
            <Route path={"/contactus"} element={<ContactUs />} />
            <Route path={"/uzenetek"} element={<UserMessages />} />
            
          </Routes>
          <Footer />
        </Router>
        <ToastContainer />
      </UserProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
