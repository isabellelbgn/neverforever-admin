import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminUpdate() {
  const [admin, setAdmin] = useState({
    adminName: "",
    adminEmailAddress: "",
    adminUsername: "",
    adminPassword: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const adminId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/admins/${adminId}`
        );
        const adminData = response.data;

        setAdmin({
          adminName: adminData.admin_name,
          adminEmailAddress: adminData.admin_emailAddress,
          adminUsername: adminData.admin_username,
          adminPassword: adminData.admin_password,
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, [adminId]);

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/admins/update/${adminId}`, admin);
      navigate("/admins");
    } catch (err) {
      console.error("Error updating admin:", err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Update Admin </h1>

        <div className="mb-2">
          <label>Admin Name</label>
          <input
            type="text"
            placeholder="Enter Admin Name"
            name="adminName"
            value={admin.adminName}
            onChange={handleChange}
          />
        </div>

        <label> Email Address </label>
        <input
          type="text"
          placeholder="Enter Email Address"
          name="adminEmailAddress"
          value={admin.adminEmailAddress}
          onChange={handleChange}
        />

        <label> Username </label>
        <input
          type="text"
          placeholder="Enter Username"
          name="adminUsername"
          value={admin.adminUsername}
          onChange={handleChange}
        />

        <label> Password </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="adminPassword"
          value={admin.adminPassword}
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

export default AdminUpdate;
