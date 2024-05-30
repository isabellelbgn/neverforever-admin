import Nav from "./Nav";
import React, { useState } from "react";
import Logo from "./Logo";
import { AiOutlineMenu } from "react-icons/ai";
import Home from "./Home";
import axios from "axios";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const toggleNav = () => {
    setShowNav(!showNav);
  };

  axios.defaults.withCredentials = true;

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {isAdminLoggedIn ? (
        <>
          <div className="block md:hidden flex items-center justify-center p-4">
            <button className="md:hidden" onClick={toggleNav}>
              <AiOutlineMenu />
            </button>

            <div className="flex grow justify-center mr-8">
              <Logo />
            </div>
          </div>

          <div className="flex">
            <Nav show={showNav} toggleNav={toggleNav} />
            <div className="flex-grow p-5">{children}</div>
          </div>
        </>
      ) : (
        <Home onAdminLogin={handleAdminLogin} />
      )}
    </div>
  );
}
