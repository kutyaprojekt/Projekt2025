import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const { refresh, user, SetRefresh } = useContext(UserContext);
  const [token, setToken] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closepanel = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem("usertoken"));
    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    setToken(null);
    SetRefresh((prev) => !prev);
    handleLinkClick();
    navigate("/home");
  };

  const handleLinkClick = () => {
    if (closepanel.current) {
      closepanel.current.removeAttribute('open');
    }
    setIsMenuOpen(false);
  };

  const isLoggedIn = !!token;

  // Alapértelmezett kép URL-je
  const defaultProfilePicture = "default-profile.jpg";

  // Felhasználó profilképének URL-je
  const profilePictureUrl = user?.profilePicture
    ? `http://localhost:8000/${user.profilePicture.replace(/\\/g, '/')}?${Date.now()}`
    : defaultProfilePicture;

  return (
    <nav className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md fixed w-full z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/home" className="flex items-center">
              <svg
                className="h-10 w-auto"
                viewBox="0 0 370 70"
                fill={theme === "dark" ? "#fff" : "#111"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="matrix(0.7777792942406351,0,0,0.7777792942406351,-3.8887362536056376,-3.8888489993224233)" fill={theme === "dark" ? "#fff" : "#111"}>
                  <g xmlns="http://www.w3.org/2000/svg" transform="translate(0,-952.36)">
                    <g>
                      <g transform="translate(40,0)">
                        <g transform="matrix(7.7587851,0,0,7.7587851,-2088.131,-3170.2789)">
                          <path d="m 271.14503,531.99552 c -0.36249,0 0.36249,1.44997 -0.36249,0.72498 -0.72498,-0.72498 -1.08748,-0.72498 -1.08748,-0.72498 -0.72498,0 0.72499,1.81246 0,2.53744 -0.72498,0.72499 -1.44997,0.36249 -2.17495,1.81246 -0.72499,1.44997 -1.44997,1.44997 -2.89994,2.17496 0,1.08747 1.44997,1.81246 2.53745,1.81246 2.89993,-2.17496 3.98741,1.08748 5.43738,3.26243 3.62492,-1.44997 1.44997,-4.34991 3.62492,-7.61234 -2.25758,-0.17327 -4.3499,-3.98741 -5.07489,-3.98741 z"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
                <g transform="matrix(2.627627687829454,0,0,2.627627687829454,88.94895118017915,0.6021051573448108)" fill={theme === "dark" ? "#fff" : "#111"}>
                  <path d="M12.36 20 l-0.98 -2.32 l-6.58 0 l-0.98 2.32 l-3.42 0 l6.22 -14 l2.94 0 l6.22 14 l-3.42 0 z M5.92 15.059999999999999 l4.36 0 l-2.18 -5.16 z M20.36 5.859999999999999 l0 14.14 l-3.16 0 l0 -14.14 l3.16 0 z M25.56 5.859999999999999 l0 14.14 l-3.16 0 l0 -14.14 l3.16 0 z M35.08 9.6 l3.16 0 l0 10.4 l-3.16 0 l0 -1.04 c-0.14 0.36 -1.08 1.24 -2.68 1.24 c-2.38 0 -5.12 -1.7 -5.12 -5.42 c0 -3.58 2.74 -5.36 5.12 -5.36 c1.6 0 2.54 0.92 2.68 1.14 l0 -0.96 z M32.86 17.42 c1.3 0 2.36 -0.9 2.36 -2.64 c0 -1.68 -1.06 -2.58 -2.36 -2.58 c-1.36 0 -2.52 0.92 -2.52 2.58 c0 1.72 1.16 2.64 2.52 2.64 z M45.339999999999996 17.36 c0.56 0 0.96 -0.08 1.4 -0.2 l0 2.62 c-0.44 0.2 -1.16 0.34 -2.22 0.34 c-1.74 0 -3.2 -0.58 -3.2 -3.78 l0 -4.14 l-1.46 0 l0 -2.6 l1.46 0 l0 -2.44 l3.16 0 l0 2.44 l2.22 0 l0 2.6 l-2.22 0 l0 4.14 c0 0.46 0.12 1.02 0.86 1.02 z M56.4 20 l-2.86 -4.58 l-1.72 0 l0 4.58 l-3.22 0 l0 -14 l4.98 0 c3.14 0 5.22 1.9 5.22 4.82 c0 1.86 -0.88 3.26 -2.36 3.98 l3.36 5.2 l-3.4 0 z M51.82 8.96 l0 3.72 l1.56 0 c1.3 0 2.2 -0.46 2.2 -1.86 c0 -1.38 -0.9 -1.86 -2.2 -1.86 l-1.56 0 z M68.9 9.6 l3.16 0 l0 10.4 l-3.16 0 l0 -1.04 c-0.14 0.36 -1.08 1.24 -2.68 1.24 c-2.38 0 -5.12 -1.7 -5.12 -5.42 c0 -3.58 2.74 -5.36 5.12 -5.36 c1.6 0 2.54 0.92 2.68 1.14 l0 -0.96 z M66.67999999999999 17.42 c1.3 0 2.36 -0.9 2.36 -2.64 c0 -1.68 -1.06 -2.58 -2.36 -2.58 c-1.36 0 -2.52 0.92 -2.52 2.58 c0 1.72 1.16 2.64 2.52 2.64 z M81.58 5.859999999999999 l3.16 0 l0 5.08 l0 9.06 l-3.16 0 l0 -1.04 c-0.14 0.36 -1.08 1.24 -2.68 1.24 c-2.38 0 -5.12 -1.7 -5.12 -5.42 c0 -3.58 2.74 -5.36 5.12 -5.36 c1.6 0 2.54 0.92 2.68 1.14 l0 -4.7 z M79.36 17.42 c1.3 0 2.36 -0.9 2.36 -2.64 c0 -1.68 -1.06 -2.58 -2.36 -2.58 c-1.36 0 -2.52 0.92 -2.52 2.58 c0 1.72 1.16 2.64 2.52 2.64 z M94.25999999999999 9.6 l3.16 0 l0 10.4 l-3.16 0 l0 -1.04 c-0.14 0.36 -1.08 1.24 -2.68 1.24 c-2.38 0 -5.12 -1.7 -5.12 -5.42 c0 -3.58 2.74 -5.36 5.12 -5.36 c1.6 0 2.54 0.92 2.68 1.14 l0 -0.96 z M92.03999999999999 17.42 c1.3 0 2.36 -0.9 2.36 -2.64 c0 -1.68 -1.06 -2.58 -2.36 -2.58 c-1.36 0 -2.52 0.92 -2.52 2.58 c0 1.72 1.16 2.64 2.52 2.64 z M106.14 9.44 c0.28 0 0.56 0 0.82 0.06 l0 3.02 c-0.24 -0.06 -0.52 -0.06 -0.72 -0.06 c-1.92 0 -3.46 1.38 -3.62 3.3 l0 4.24 l-3.16 0 l0 -10.4 l3.16 0 l0 2.54 c0.48 -1.56 1.68 -2.7 3.52 -2.7 z"></path>
                </g>
              </svg>
            </Link>
          </div>

          {/* Central Menu (for large screens) */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/elveszettallat" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
              Elveszett Kisállatom
            </Link>
            <Link to="/talaltallat" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
              Kisállatot Találtam
            </Link>
            <Link to="/osszallat" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
              Összes elveszett
            </Link>
            <Link to="/megtalaltallatok" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
              Megtalált
            </Link>
          </div>

          {/* Right Section: Profile Menu and Theme Toggle */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1 md:p-2 mr-2 md:mr-4 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
            >
              {theme === "light" ? (
                <FaMoon className="text-gray-800 w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <FaSun className="text-yellow-500 w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full overflow-hidden hover:ring-4 hover:ring-blue-400 transition duration-300">
                  <img
                    alt="Profile"
                    src={profilePictureUrl}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className={`menu menu-sm dropdown-content ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-xl mt-3 w-52 p-2 transition-all duration-300 ease-in-out transform hover:scale-105 z-[1]`}
              >
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        to="/profilom"
                        className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:bg-blue-400 hover:text-white transition duration-200 rounded-lg py-2 px-4`}
                        onClick={handleLinkClick}
                      >
                        Profilom
                      </Link>
                    </li>
                    {user && user.admin === "true" && (
                      <>
                        <li>
                          <Link
                            to="/adminposts"
                            className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:bg-blue-400 hover:text-white transition duration-200 rounded-lg py-2 px-4`}
                            onClick={handleLinkClick}
                          >
                            Bejegyzések
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/adminusers"
                            className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:bg-blue-400 hover:text-white transition duration-200 rounded-lg py-2 px-4`}
                            onClick={handleLinkClick}
                          >
                            Felhasználók
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <button
                        onClick={logout}
                        className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:bg-red-500 hover:text-white transition duration-200 rounded-lg py-2 px-4`}
                      >
                        Kijelentkezés
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/regisztracio"
                        className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:bg-blue-400 hover:text-white transition duration-200 rounded-lg py-2 px-4`}
                        onClick={handleLinkClick}
                      >
                        Regisztráció
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:bg-blue-400 hover:text-white transition duration-200 rounded-lg py-2 px-4`}
                        onClick={handleLinkClick}
                      >
                        Bejelentkezés
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <ul className="flex flex-col space-y-4 p-4">
          <li>
            <Link to="/elveszettallat" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
              Elveszett feltöltés
            </Link>
          </li>
          <li>
            <Link to="/talaltallat" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
              Megtalált feltöltés
            </Link>
          </li>
          <li>
            <Link to="/osszallat" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
              Összes elveszett
            </Link>
          </li>
          <li>
            <Link to="/megtalaltallatok" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
              Megtalált
            </Link>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <Link to="/profilom" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
                  Profilom
                </Link>
              </li>
              <li>
                <Link to="/posztjaim" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
                  Posztjaim
                </Link>
              </li>
            </>
          )}
          {user && user.admin === "true" && (
            <>
              <li>
                <Link to="/adminposts" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
                  Bejegyzések
                </Link>
              </li>
              <li>
                <Link to="/adminusers" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
                  Felhasználók
                </Link>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/regisztracio" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
                  Regisztráció
                </Link>
              </li>
              <li>
                <Link to="/login" className={`${theme === "dark" ? "text-white" : "text-black"} text-lg hover:text-blue-500 transition duration-300`} onClick={handleLinkClick}>
                  Bejelentkezés
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;