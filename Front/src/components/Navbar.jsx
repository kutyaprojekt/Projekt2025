import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react"; // useRef importálása
import UserContext from "../context/UserContext";

const Navbar = () => {
  const { refresh, user } = useContext(UserContext);
  const [token, setToken] = useState("");
  const closepanel = useRef(null); // Referencia a <details> elemhez

  useEffect(() => {
    setToken(localStorage.getItem("usertoken"));
  }, [refresh]);

  const logout = () => {
    localStorage.removeItem("usertoken");
    setToken(null);
  };

  // Funkció a kattintás esemény kezelésére
  const handleLinkClick = () => {
    if (closepanel.current) {
      closepanel.current.removeAttribute('open'); // Bezárja a <details> elemet
    }
  };

  const isLoggedIn = !!token; // true, ha van token, különben false

  return (
    <div className="navbar bg-base-100 flex justify-between items-center">
      {/* Bal oldali rész */}
      <div className="flex-1">
        <li className="btn btn-ghost text-xl"><Link to={"/login"}>FYP</Link></li>
      </div>

      {/* Középső menü */}
      {isLoggedIn && (
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to={"/elveszettallat"}>Elveszett A Kisállatom</Link></li>
            <li><Link to={"/talaltallat"}>Kóbor Állatot Találtam</Link></li>
            <li><Link to={"/osszallat"}>Összes állat</Link></li>
            <li><Link to={"/osszallat"}>Megtalállt Állatok</Link></li>
            <li><Link to={"/osszallat"}>Posztjaim</Link></li>
            
            {user && user.admin === "true" && (
               <li>
               <details ref={closepanel}> {/* Referencia hozzáadva */}
                 <summary>Admin Panel</summary>
                 <ul className="p-2">
                   <li>
                     <Link to={"/adminposts"} onClick={handleLinkClick}>
                       <a>Bejegyzések</a>
                     </Link>
                   </li> 
                   <li>
                     <Link to={"/adminusers"} onClick={handleLinkClick}>
                       <a>Felhasználók</a>
                     </Link>
                   </li>
                 </ul>
               </details>
             </li>
            )}
            
          </ul>
        </div>
      )}

      {/* Jobb oldali rész */}
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>

          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            {isLoggedIn ? (
              <>
                <li><Link to={"/felhasznalok"}>Felhasználók</Link></li>
                <li><Link to={"/profilom"}>Profilom</Link></li>
                <li onClick={logout}> <Link to={"/login"}>Kijelentkezés</Link><a></a></li>
              </>
            ) : (
              <>
                <li><Link to={"/regisztracio"}>Regisztráció</Link></li>
                <li><Link to={"/login"}>Login</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;