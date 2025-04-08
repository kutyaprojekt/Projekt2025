import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import LostAnimalTemplate from "./LostAnimalTemplate";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const [happyStories, setHappyStories] = useState([]);
  const [lostAnimals, setLostAnimals] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const { theme } = useTheme();

  // Intersection Observer hookok
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: storiesRef, inView: storiesInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: lostAnimalsRef, inView: lostAnimalsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Elveszett állatok lekérése
  useEffect(() => {
    const fetchLostAnimals = async () => {
      try {
        const response = await fetch("http://localhost:8000/felhasznalok/osszeselveszett", {
          method: 'GET',
          headers: {
            "Content-type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Hiba történt az elveszett állatok lekérése során");
        }

        const data = await response.json();
        setLostAnimals(data);
      } catch (error) {
        console.error("Hiba történt az elveszett állatok lekérése során:", error);
      }
    };

    fetchLostAnimals();
  }, []);

  // Boldog történetek lekérése
  useEffect(() => {
    const fetchHappyStories = async () => {
      try {
        const response = await fetch("http://localhost:8000/felhasznalok/happy-stories", {
          method: 'GET',
          headers: {
            "Content-type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Hiba történt a boldog történetek lekérése során");
        }

        const data = await response.json();
        setHappyStories(data);
      } catch (error) {
        console.error("Hiba történt a boldog történetek lekérése során:", error);
      }
    };

    fetchHappyStories();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Automatikus lapozás beállítása a történeteknél
  useEffect(() => {
    if (happyStories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % happyStories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [happyStories.length]);

  // Billentyűzet események kezelése
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        goToPreviousStory();
      } else if (event.key === "ArrowRight") {
        goToNextStory();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStoryIndex]);

  const goToNextStory = () => {
    if (happyStories.length === 0) return;
    setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % happyStories.length);
  };

  const goToPreviousStory = () => {
    if (happyStories.length === 0) return;
    setCurrentStoryIndex((prevIndex) => (prevIndex - 1 + happyStories.length) % happyStories.length);
  };

  // Segédfüggvény a megjelenítendő történetek indexeinek kiszámításához
  const getVisibleStories = () => {
    if (happyStories.length === 0) return [];
    if (happyStories.length === 1) return [0];
    if (happyStories.length === 2) return [0, 1];
    
    const prevIndex = (currentStoryIndex - 1 + happyStories.length) % happyStories.length;
    const nextIndex = (currentStoryIndex + 1) % happyStories.length;
    return [prevIndex, currentStoryIndex, nextIndex];
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-[#073F48]"} min-h-screen pt-16 md:pt-0 no-scroll`}>
      {/* Hero Section */}
      <div
        ref={heroRef}
        className={`${theme === "dark" ? "bg-gray-800" : "bg-gradient-to-r from-[#64B6FF] to-[#A7D8FF]"} text-white py-12 md:py-32 relative overflow-hidden transition-opacity duration-1000 ${heroInView ? "opacity-100" : "opacity-0"}`}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-6xl font-bold mb-4">Segítsünk az Állatoknak Hazatalálni!</h1>
          <p className="text-sm md:text-2xl mb-6">
            Az "Állatkereső és -megtaláló Rendszer" segít az elveszett háziállatok gyors és hatékony visszakerülésében.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <button className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-100 text-[#074F57]"} font-semibold py-2 px-4 md:py-3 md:px-8 rounded-full transition duration-300 shadow-lg text-sm md:text-base`}>
              <Link to={"/elveszettallat"}>Elveszett Kisállatom</Link>
            </button>
            <button className={`${theme === "dark" ? "bg-transparent border-2 border-gray-700 hover:bg-gray-700" : "bg-transparent border-2 border-white hover:bg-white hover:text-[#074F57]"} text-white font-semibold py-2 px-4 md:py-3 md:px-8 rounded-full transition duration-300 shadow-lg text-sm md:text-base`}>
              <Link to={"/talaltallat"}>Állatot találtam</Link>
            </button>
          </div>
        </div>
        {/* Háttérkép */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Hero Background"
            className="w-full h-1/2 md:h-full object-cover opacity-20"
          />
        </div>
      </div>

      {/* Boldog Történetek (Megtalált állatok) */}
      <div
        ref={storiesRef}
        className={`container mx-auto px-4 py-8 md:py-20 transition-opacity duration-1000 ${storiesInView ? "opacity-100" : "opacity-0"}`}
      >
        <h2 className={`text-2xl md:text-4xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-6 md:mb-16`}>Sikertörténetek</h2>
        <p className={`text-center mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Ezek az állatok már hazataláltak szerető gazdájukhoz
        </p>
        
        <div className="relative flex justify-center items-center">
          {/* Balra nyíl */}
          <button
            onClick={goToPreviousStory}
            className={`absolute left-[-20px] md:left-[-40px] top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} p-2 md:p-3 rounded-full shadow-lg z-10 transition duration-300`}
          >
            <svg className={`w-4 h-4 md:w-6 md:h-6 ${theme === "dark" ? "text-white" : "text-[#073F48]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Jobbra nyíl */}
          <button
            onClick={goToNextStory}
            className={`absolute right-[-20px] md:right-[-40px] top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} p-2 md:p-3 rounded-full shadow-lg z-10 transition duration-300`}
          >
            <svg className={`w-4 h-4 md:w-6 md:h-6 ${theme === "dark" ? "text-white" : "text-[#073F48]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* Történet kártyák */}
          <div className="flex space-x-4 md:space-x-8 items-center w-full md:w-auto">
            {/* Mobilnézet: 1 kép */}
            <div className="md:hidden w-full">
              {happyStories.length > 0 ? (
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} p-4 md:p-8 rounded-2xl shadow-xl`}>
                  <div className="relative h-32 md:h-60 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={happyStories[currentStoryIndex]?.filePath ? `http://localhost:8000/${happyStories[currentStoryIndex].filePath}` : "https://via.placeholder.com/400x300"}
                      alt={happyStories[currentStoryIndex]?.allatfaj}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className={`text-lg md:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-2 md:mb-4`}>
                    {happyStories[currentStoryIndex]?.allatfaj || "Ismeretlen állat"}
                  </h3>
                  <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} text-xs md:text-base`}>
                    {happyStories[currentStoryIndex]?.visszajelzes || "Nincs leírás"}
                  </p>
                </div>
              ) : (
                <p className={`text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Még nincsenek sikertörténetek.</p>
              )}
            </div>

            {/* Gépi nézet: 3 kép */}
            <div className="hidden md:flex gap-6">
              {happyStories.length > 0 ? (
                getVisibleStories().map((index) => (
                  <div
                    key={happyStories[index]?.id || index}
                    className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-300 ${
                      index === currentStoryIndex ? "scale-110 transform-origin-center z-20" : "scale-90 opacity-75 z-10"
                    }`}
                  >
                    <div className="relative h-48 md:h-60 mb-4 overflow-hidden rounded-2xl">
                      <img
                        src={happyStories[index]?.filePath ? `http://localhost:8000/${happyStories[index].filePath}` : "https://via.placeholder.com/400x300"}
                        alt={happyStories[index]?.allatfaj || "Ismeretlen állat"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-4`}>
                      {happyStories[index]?.allatfaj || "Ismeretlen állat"}
                    </h3>
                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} text-sm md:text-base`}>
                      {happyStories[index]?.visszajelzes || "Nincs leírás"}
                    </p>
                  </div>
                ))
              ) : (
                <p className={`text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Még nincsenek sikertörténetek.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Elveszett Állatok */}
      <div
        ref={lostAnimalsRef}
        className={`${theme === "dark" ? "bg-gray-800" : "bg-[#F0EDEE]"} py-8 md:py-20 transition-opacity duration-1000 ${lostAnimalsInView ? "opacity-100" : "opacity-0"}`}
      >
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-4xl font-bold text-center ${theme === "dark" ? "text-white" : "text-[#073F48]"} mb-6 md:mb-16`}>Elveszett Állatok</h2>
          <p className={`text-center mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Ezek az állatok még keresik szerető otthonukat
          </p>
          
          <div className="flex flex-wrap justify-center gap-8">
            {lostAnimals && lostAnimals.length > 0 ? (
              lostAnimals.slice(0, 6).map((animal) => (
                <div
                  key={animal.id}
                  className="w-full sm:w-auto"
                >
                  <LostAnimalTemplate animal={animal} />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-4`}>
                  Jelenleg nincsenek jóváhagyott elveszett állatok.
                </p>
                <p className={`text-base ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Ha elveszett a kisállatod, kattints az "Elveszett Kisállatom" gombra a főoldalon.
                </p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/osszeselveszett"
              className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-[#64B6FF] hover:bg-[#88c4f8]"} text-white font-semibold py-2 px-4 md:py-3 md:px-8 rounded-full transition duration-300 shadow-lg text-sm md:text-base`}
            >
              További elveszett állatok megtekintése
            </Link>
          </div>
        </div>
      </div>

      {/* CTA (Call to Action) */}
      <div
        ref={ctaRef}
        className={`py-8 md:py-20 transition-opacity duration-1000 ${ctaInView ? "opacity-100" : "opacity-0"}`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-2xl md:text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-[#073F48]"}`}>Segítsünk Együtt!</h2>
          <p className={`text-sm md:text-2xl mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Csatlakozz közösségünkhöz, és segíts az elveszett állatok hazatalálásában.
          </p>
          <button className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600  text-white " : "bg-white hover:bg-gray-100"} text-[#073F48] font-semibold py-2 px-4 md:py-3 md:px-8 rounded-full transition duration-300 shadow-lg text-sm md:text-base`}>
            <Link to={"/regisztracio"}>Regisztrálj most</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;