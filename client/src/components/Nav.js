import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import axios from "axios";
import { AiOutlineMenu } from "react-icons/ai";

function Nav({ show, toggleNav }) {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const inactiveLink = "flex gap-1 p-1";
  const activeLink = inactiveLink + " text-highlight rounded-sm";

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8081/logout");
      if (response.data.loggedOut) {
        setIsLoggedOut(true);
        navigate("/");
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <aside
        className={`top-0 text-base text-black font-semibold p-8 fixed w-full bg-white h-full md:static md:w-auto ${
          show ? "left-0" : "-left-full"
        } transition-all`}
      >
        <div className="mb-4 mr-4">
          {show && (
            <button onClick={toggleNav} className="md:hidden">
              <AiOutlineMenu />
            </button>
          )}

          <Logo />
        </div>

        <nav className="md:flex md:flex-col md:gap-3 md:items-center md:text-center">
          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard" ? activeLink : inactiveLink
            }
          >
            DASHBOARD
          </Link>

          <Link
            to="/customers"
            className={
              location.pathname === "/customers" ? activeLink : inactiveLink
            }
          >
            CUSTOMERS
          </Link>

          <Link
            to="/rewards"
            className={
              location.pathname.startsWith("/rewards")
                ? activeLink
                : inactiveLink
            }
          >
            REWARDS
          </Link>
          <Link
            to="/suppliers"
            className={
              location.pathname.startsWith("/suppliers")
                ? activeLink
                : inactiveLink
            }
          >
            SUPPLIERS
          </Link>
          <Link
            to="/purchaseorders"
            className={
              location.pathname.startsWith("/purchaseorders")
                ? activeLink
                : inactiveLink
            }
          >
            <div>PURCHASE </div>
            ORDERS
          </Link>

          <Link
            to="/products"
            className={
              location.pathname.startsWith("/products")
                ? activeLink
                : inactiveLink
            }
          >
            PRODUCTS
          </Link>

          <Link
            to="/reviews"
            className={
              location.pathname.startsWith("/reviews")
                ? activeLink
                : inactiveLink
            }
          >
            REVIEWS
          </Link>

          <Link
            to="/discounts"
            className={
              location.pathname.startsWith("/discounts")
                ? activeLink
                : inactiveLink
            }
          >
            DISCOUNTS
          </Link>

          <Link
            to="/categories"
            className={
              location.pathname === "/categories" ? activeLink : inactiveLink
            }
          >
            CATEGORIES
          </Link>

          <Link
            to="/orders"
            className={
              location.pathname === "/orders" ? activeLink : inactiveLink
            }
          >
            ORDERS
          </Link>

          <Link
            to="/requests"
            className={
              location.pathname === "/requests" ? activeLink : inactiveLink
            }
          >
            REQUESTS
          </Link>

          <Link
            to="/requestlogs"
            className={
              location.pathname === "/requestlogs" ? activeLink : inactiveLink
            }
          >
            REQUEST LOGS
          </Link>

          <Link
            to="/payments"
            className={
              location.pathname === "/payments" ? activeLink : inactiveLink
            }
          >
            PAYMENTS
          </Link>

          <Link
            to="/deliverylogs"
            className={
              location.pathname === "/deliverylogs" ? activeLink : inactiveLink
            }
          >
            SHIPMENTS
          </Link>

          <Link
            to="/admins"
            className={
              location.pathname === "/admins" ? activeLink : inactiveLink
            }
          >
            ADMINS
          </Link>

          <button
            className={`${inactiveLink} bg-black text-white text-sm font-normal rounded-md py-3 px-6 text-right whitespace-pre md:whitespace-normal`}
            onClick={handleLogout}
          >
            LOGOUT
          </button>
        </nav>
      </aside>
    </div>
  );
}

export default Nav;
