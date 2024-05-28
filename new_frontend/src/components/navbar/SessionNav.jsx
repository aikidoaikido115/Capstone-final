import React, { useState, useEffect, useRef } from "react";
// import logo from "../../../public/animeHub V2.png";
// import premium_logo from "../../../public/animeHub_premium.png";
import { Link, useNavigate } from "react-router-dom";

import SmallCircle from "../profile_fit_circle/small";

import axios from "axios";

const NavbarSession = ({Logout, User_image, logo}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navbarRef = useRef(null);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Search value:", searchValue);


    navigate(`/search_result?q=${searchValue}`)
  };

  useEffect(() => {
    const checkScrollTop = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop === 0) {
        // User has scrolled to the top
        console.log("User scrolled to the top");
        // Add your logic here, such as adding a class to an element
        navbarRef.current.classList.add('bg-transparent');
      }
      else {
        navbarRef.current.classList.remove('bg-transparent');
      }
    };
  
    window.addEventListener("scroll", checkScrollTop);
  
    // Call checkScrollTop immediately after adding the event listener
    checkScrollTop();
  
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  return (
    <nav ref={navbarRef} className="bg-black p-4 flex justify-between items-center sticky top-0 z-10 transition duration-500 ease-linear">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="ml-10 cursor-pointer w-32 transition-all duration-300 hover:scale-110 hover:z-10" />
        </Link>
        <ul className="ml-10 flex space-x-6 text-white">
            <Link to="/category/?sort=newest&category=all&status=all">
                <li className="flex items-center mr-4 cursor-pointer hover:animate-pulse animate-once transition-all duration-300 hover:scale-110 hover:z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 mr-2">
                        <rect x="2" y="2" width="7.5" height="7.5" />
                        <rect x="12" y="2" width="7.5" height="7.5" />
                        <rect x="2" y="12" width="7.5" height="7.5" />
                        <rect x="12" y="12" width="7.5" height="7.5" />
                    </svg>
                    Category
                </li>
            </Link>

            <Link to="/watch_list">
                <li className="flex items-center mr-4 cursor-pointer hover:animate-pulse animate-once transition-all duration-300 hover:scale-110 hover:z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                    stroke="currentColor" className="w-8 h-8 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                    My Watchlist
                </li>
            </Link>
        </ul>
      </div>
      <div className="flex items-center">
      <form onSubmit={handleSubmit} className="flex items-center mr-6 ">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="Search here. . ."
              className="pl-5 px-12 py-3 rounded-full border border-white text-black hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 py-1 border border-white bg-amber-500 rounded-full text-white font-semibold transition-all duration-300 hover:scale-110 hover:z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
              </svg>
            </button>
          </div>
        </form>

        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center bg-amber-500 px-4 py-2 rounded-full text-white font-semibold transition-all duration-300 hover:scale-110 hover:z-10">
            <SmallCircle src={User_image}/>
            {/* <img src={User_image} alt="User Avatar" className="w-8 h-8 mr-2 rounded-full object-cover" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2 rotate-icon animate-rotate-left">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {/*Dropdown*/}
          <div className={`absolute right-0 mt-2 w-48 bg-black shadow-lg border border-white ${isOpen ? 'block' : 'hidden'} transition-all duration-300 hover:scale-110 hover:z-10`}>
            <a href="/user_profile" className="block px-4 py-2 text-white hover:bg-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Profile 
            </a>
            <a href="/premium" className="block px-4 py-2 text-white hover:bg-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Premium
            </a>
            <a href="/" onClick={Logout} className="block px-4 py-2 text-white hover:bg-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
              </svg>
              Sign out
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarSession;