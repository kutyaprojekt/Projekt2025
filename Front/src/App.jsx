import AdminPanelPosts from "./components/Admin/AdminPanelPosts";
import AdminPanelUsers from "./components/Admin/AdminPanelUsers";


import Navbar from "./components/Assets/Navbar";
import Footer from "./components/Assets/Footer";


import Login from "./components/HomePage/Login";
import Register from "./components/HomePage/Register";
import Home from "./components/HomePage/HomePage";
import LostAnimals from "./components/HomePage/LostAnimals";


import MyProfile from "./components/LoggedUser/MyProfile";


import RegisterThePetIFound from "./components/Animals/RegisterThePetIFound";
import RegisterMyLostPet from "./components/Animals/RegisterMyLostPet";
import FoundAnimals from "./components/Animals/FoundAnimals"


import UserList from "./components/UserList";
import UserPosts from "./components/LoggedUser/UserPosts";


;








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
          </Routes>
          <Footer />
        </Router>
        <ToastContainer />
      </UserProvider>
    </>
  );
}

export default App;
