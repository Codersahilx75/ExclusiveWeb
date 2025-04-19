import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useModal } from "../context/ModalContext";
import { useAuth } from '../context/AuthContext';
import logo from "../assets/img/header/logo3.png";

function Header() {
  const searchItems = [
    "coffee",
    "wireless headphones",
    "Nike shoes",
    "laptop stand",
    "kitchen essentials",
    "electronics products",
  ];

  const { cart } = useCart();
  const { setShowLoginModal } = useModal();
  const { user } = useAuth(); // Get user from AuthContext

  const [index, setIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % searchItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="SwiftCart Logo" className="h-auto w-20" />
            </Link>
        
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex mx-4">
            <ul className="flex gap-4 lg:gap-6 text-base lg:text-lg font-medium">
              {[
                { path: "/", label: "Home" },
                { path: "/category/electronics", label: "Electronics" },
                { path: "/category/clothing", label: "Clothes" },
                { path: "/category/coffee", label: "Coffee" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`transition px-2 lg:px-3 py-1 lg:py-2 rounded-md border-t-2 border-b-2 border-transparent ${
                      location.pathname === path
                        ? "bg-gradient-to-r from-white to-purple-800 bg-clip-text text-transparent animate-gradient border-white"
                        : "hover:text-gray-200 hover:border-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full bg-white px-3 py-1 lg:px-4 lg:py-3 rounded-lg shadow-md flex items-center">
              <FiSearch className="text-gray-500 mr-2" />
              <input 
                type="text" 
                className="outline-none w-full text-gray-700 text-sm lg:text-base" 
                placeholder="Search for" 
              />
              <div className="absolute left-24 lg:left-32 text-gray-500 overflow-hidden h-5 lg:h-6 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={searchItems[index]}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className="text-xs lg:text-sm"
                  >
                    {searchItems[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* User & Cart Icons */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            {user ? (
              <Link to="/profile">
                <button className="flex flex-col items-center text-white hover:text-gray-200 transition">
                  <FaRegUserCircle className="text-xl sm:text-2xl lg:text-3xl" />
                  <span className="text-xs sm:text-sm">{user.name.split(" ")[0]}</span>
                </button>
              </Link>
            ) : (
              <button
                className="flex flex-col items-center text-white hover:text-gray-200 transition"
                onClick={() => setShowLoginModal(true)}
              >
                <FaRegUserCircle className="text-xl sm:text-2xl lg:text-3xl" />
                <span className="text-xs sm:text-sm">Login</span>
              </button>
            )}

            <Link to="/cart" className="relative">
              <button className="flex flex-col items-center text-white hover:text-gray-200 transition">
                <IoCartOutline className="text-xl sm:text-2xl lg:text-3xl" />
                <span className="text-xs sm:text-sm">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-2 sm:-top-2 sm:-right-3 bg-purple-800 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
            </Link>

            <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden w-full mt-3">
          <div className="relative w-full bg-white px-4 py-2 rounded-lg shadow-md flex items-center">
            <FiSearch className="text-gray-500 mr-2" />
            <input type="text" className="outline-none w-full text-gray-700" placeholder="Search for " />
            <div className="absolute left-32 sm:left-36 text-gray-500 overflow-hidden h-6 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={searchItems[index]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="text-sm"
                >
                  {searchItems[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation for Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-3/4 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 md:hidden p-6 shadow-lg z-50"
          >
            <div className="flex justify-between items-center">
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="SwiftCart Logo" className="h-auto w-20" />
            </Link>
              <button className="text-white text-2xl" onClick={() => setMenuOpen(false)}>
                <FiX />
              </button>
            </div>
            <ul className="flex flex-col gap-6 text-lg font-medium text-white mt-10">
              {[
                { path: "/", label: "Home" },
                { path: "/category/electronics", label: "Electronics" },
                { path: "/category/clothing", label: "Clothes" },
                { path: "/category/coffee", label: "Coffee" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`transition px-2 lg:px-3 py-1 lg:py-2 rounded-md border-t-2 border-b-2 border-transparent ${
                      location.pathname === path
                        ? "bg-gradient-to-r from-white to-purple-800 bg-clip-text text-transparent animate-gradient border-white"
                        : "hover:text-gray-200 hover:border-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Modals */}
      {/* {showLoginModal && <LoginModal onSuccess={setUser} onClose={() => setShowLoginModal(false)} onRegister={() => setShowRegisterModal(true)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} onRegisterSuccess={setUser} />} */}
    </motion.header>
  );
}

export default Header;