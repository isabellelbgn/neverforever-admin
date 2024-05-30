import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

function Home({ onAdminLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const response = await axios.get("http://localhost:8081/login");
        if (response.data.loggedIn) {
          setIsLoggedIn(true);
          onAdminLogin();
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
      }
    };

    checkAdminSession();
  }, []);

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/login", {
        username,
        password,
      });

      if (response.data.Login) {
        setIsLoggedIn(true);
        onAdminLogin();
        navigate("/dashboard");
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error.response.data);
      alert("An error occurred while logging in");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-md shadow-md">
        <div className="mb-4 mr-4">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
          Admin Login
        </h2>
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              className="w-full py-2 px-4 border border-gray-300 rounded-md mb-4"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full py-2 px-4 border border-gray-300 rounded-md mb-4"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
