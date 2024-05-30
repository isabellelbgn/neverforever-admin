import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminAdd() {
  const [admin, setAdmin] = useState({
    adminName: "",
    adminEmailAddress: "",
    adminUsername: "",
    adminPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdmin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const { adminName, adminEmailAddress, adminUsername, adminPassword } =
        admin;
      await axios.post("http://localhost:8081/admins", {
        admin_name: adminName,
        admin_emailAddress: adminEmailAddress,
        admin_username: adminUsername,
        admin_password: adminPassword,
      });
      navigate("/admins");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Add Admin </h1>

        <div className="mb-2">
          <label>Admin Name</label>
          <input
            type="text"
            placeholder="Enter Admin Name"
            name="adminName"
            onChange={handleChange}
          />
        </div>

        <label> Email Address </label>
        <input
          type="text"
          placeholder="Enter Email Address"
          name="adminEmailAddress"
          onChange={handleChange}
        />

        <label> Username </label>
        <input
          type="text"
          placeholder="Enter Username"
          name="adminUsername"
          onChange={handleChange}
        />

        <label> Password </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="adminPassword"
          onChange={handleChange}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            {" "}
            SAVE ADMIN
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAdd;
