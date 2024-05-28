import React, {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom"
import logo from "/animeHub V2.png";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const navbarRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Search value:", searchValue);


    navigate(`/search_result?q=${searchValue}`)
  };

//   const checkScrollTop = () => {
//     const scrollTop = window.scrollY || document.documentElement.scrollTop;
//     if (scrollTop === 0) {
//       // User has scrolled to the top
//       console.log("User scrolled to the top");
//       // Add your logic here, such as adding a class to an element
//     }
//   };

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
        <ul className="hidden md:flex ml-10 space-x-6 text-white">
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              My Watchlist
            </li>
          </Link>
        </ul>
      </div>
      <div className="flex items-center">
        <form onSubmit={handleSubmit} className="flex items-center mr-6">
          <div className="relative text-sm">
            <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="Search here. . ."
              className="pl-5 px-12 py-3 rounded-full border border-white text-black hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 py-1 border border-white bg-amber-500 hover:bg-amber-600 rounded-full text-white font-semibold transition-all duration-300 hover:scale-110 hover:z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
              </svg>
            </button>
          </div>
        </form>
        <Link to="/login">
          <button className="flex items-center mr-4 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-full text-white font-semibold transition-all duration-300 hover:scale-110 hover:z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Sign in
          </button>
        </Link>
      </div>
      <div className="md:hidden flex items-center">
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="space-y-4 text-white">
          <Link to="/category/?sort=newest&category=all&status=all">
            <li className="flex items-center cursor-pointer">
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
            <li className="flex items-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              My Watchlist
            </li>
          </Link>
          <Link to="/login">
            <li className="flex items-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Sign in
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;