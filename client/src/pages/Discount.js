import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Discount() {
  const [productDiscount, setProductDiscount] = useState([]);
  const [sortOption, setSortOption] = useState("id");

  useEffect(() => {
    const fetchAllProductDiscounts = async () => {
      try {
        const res = await axios.get("http://localhost:8081/discounts");
        setProductDiscount(res.data);
        applySorting(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllProductDiscounts();
  }, [sortOption]);

  const applySorting = (data) => {
    let sortedData = [...data];

    switch (sortOption) {
      case "discountIdAsc":
        sortedData.sort(
          (a, b) => a.product_discount_id - b.product_discount_id
        );
        break;
      case "discountIdDesc":
        sortedData.sort(
          (a, b) => b.product_discount_id - a.product_discount_id
        );
        break;
      case "validityDateAsc":
        sortedData.sort(
          (a, b) =>
            new Date(a.product_discount_validFrom) -
            new Date(b.product_discount_validFrom)
        );
        break;
      case "validityDateDesc":
        sortedData.sort(
          (a, b) =>
            new Date(b.product_discount_validFrom) -
            new Date(a.product_discount_validFrom)
        );
        break;
      default:
        break;
    }

    setProductDiscount(sortedData);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product discount?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8081/discounts/" + id);
          Swal.fire(
            "Deleted!",
            "Your product discount has been deleted.",
            "success"
          );
          window.location.reload();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the product discount.",
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
            <option value="discountIdAsc">
              Product Discount ID (Ascending)
            </option>
            <option value="discountIdDesc">
              Product Discount ID (Descending)
            </option>
            <option value="validityDateAsc">Validity (Ascending)</option>
            <option value="validityDateDesc">Validity (Descending)</option>
          </select>
        </div>

        <div>
          <Link
            to="/discounts/add"
            className="px-4 py-2 ml-5 rounded-md bg-black text-white inline-block"
          >
            Add +
          </Link>
        </div>
      </div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Discount ID </td>
            <td> Name </td>
            <td> Code </td>
            <td> Valid From </td>
            <td> Valid Until </td>
            <td> Percentage </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {productDiscount.map((data, i) => (
            <tr key={i}>
              <td>{data.product_discount_id}</td>
              <td>{data.product_discount_name}</td>
              <td>{data.product_discount_code}</td>
              <td>{data.product_discount_validFrom}</td>
              <td>{data.product_discount_validUntil}</td>
              <td>{data.product_discount_percentage}</td>
              <td>
                <button className="btn-green">
                  <Link to={`/discounts/update/${data.product_discount_id}`}>
                    <BiEdit />
                  </Link>
                </button>
                <button
                  className="btn-red"
                  onClick={() => handleDelete(data.product_discount_id)}
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

export default Discount;
