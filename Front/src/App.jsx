import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import UserList from "./components/UserList";
import SajatAllat from "./components/SajatAllat";
import TalaltAllat from "./components/TalaltAllat";
import OsszAllat from "./components/OsszAllat";
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
            <Route path={"/elveszettallat"} element={<SajatAllat />} />
            <Route path={"/talaltallat"} element={<TalaltAllat />} />  
            <Route path={"/osszallat"} element={<OsszAllat />} />      
          </Routes>
        </Router>
        <ToastContainer />
      </UserProvider>
    </>
  );
}

export default App;
