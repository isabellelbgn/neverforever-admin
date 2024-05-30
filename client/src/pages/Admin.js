import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Admin() {
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    const fetchAllAdmins = async () => {
      try {
        const res = await axios.get("http://localhost:8081/admins");
        setAdmin(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllAdmins();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this admin?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8081/admins/" + id);
          Swal.fire("Deleted!", "Your supplier has been deleted.", "success");
          window.location.reload();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the supplier.",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <div className="flex justify-end m-2 mb-5 mt-6">
        <Link
          to="/admins/add"
          className="px-4 py-2 rounded-md bg-black text-white"
        >
          {" "}
          Add +
        </Link>
      </div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Admin ID </td>
            <td> Admin Name </td>
            <td> Email Address </td>
            <td> Username </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {admin.map((data, i) => (
            <tr key={i}>
              <td>{data.admin_id}</td>
              <td>{data.admin_name}</td>
              <td>{data.admin_emailAddress}</td>
              <td>{data.admin_username}</td>
              <td>
                <button className="btn-green">
                  <Link to={`/admins/update/${data.admin_id}`}>
                    <BiEdit />
                  </Link>
                </button>
                <button
                  className="btn-red"
                  onClick={() => handleDelete(data.admin_id)}
                >
                  <MdOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Admin;
