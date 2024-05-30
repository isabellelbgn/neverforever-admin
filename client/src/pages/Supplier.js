import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Supplier() {
  const [supplier, setSupplier] = useState([]);
  const [sortOption, setSortOption] = useState("name");

  useEffect(() => {
    const fetchAllSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:8081/suppliers");
        setSupplier(res.data);
        applySorting(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllSuppliers();
  }, [sortOption]);

  const applySorting = (data) => {
    let sortedData = [...data];

    switch (sortOption) {
      case "nameAsc":
        sortedData.sort((a, b) =>
          a.supplier_name.localeCompare(b.supplier_name)
        );
        break;
      case "nameDesc":
        sortedData.sort((a, b) =>
          b.supplier_name.localeCompare(a.supplier_name)
        );
        break;
      case "idAsc":
        sortedData.sort((a, b) => a.supplier_id - b.supplier_id);
        break;
      case "idDesc":
        sortedData.sort((a, b) => b.supplier_id - a.supplier_id);
        break;
      default:
        break;
    }

    setSupplier(sortedData);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this supplier?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8081/suppliers/" + id);
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
        <div className="flex items-center space-x-4">
          <label htmlFor="sortOption" className="w-20">
            Sort By:
          </label>
          <select
            className="form-control mt-2"
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="nameAsc">Supplier Name (A-Z)</option>
            <option value="nameDesc"> Supplier Name (Z-A)</option>
            <option value="idAsc">Customer Reward ID (Ascending)</option>
            <option value="idDesc">Customer Reward ID (Descending)</option>
          </select>
        </div>

        <div>
          <Link
            to="/suppliers/add"
            className="px-4 py-2 ml-5 rounded-md bg-black text-white inline-block"
          >
            Add +
          </Link>
        </div>
      </div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Supplier ID </td>
            <td> Supplier Name </td>
            <td> Contact Person </td>
            <td> Contact Number </td>
            <td> Email Address </td>
            <td> Shipping Address </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {supplier.map((data, i) => (
            <tr key={i}>
              <td>{data.supplier_id}</td>
              <td>{data.supplier_name}</td>
              <td>{data.supplier_contactPerson}</td>
              <td>{data.supplier_contactNumber}</td>
              <td>{data.supplier_emailAddress}</td>
              <td>{data.supplier_shippingAddress}</td>
              <td>
                <button className="btn-green">
                  <Link to={`/suppliers/update/${data.supplier_id}`}>
                    <BiEdit />
                  </Link>
                </button>
                <button
                  className="btn-red"
                  onClick={() => handleDelete(data.supplier_id)}
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

export default Supplier;
