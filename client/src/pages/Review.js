import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Review() {
  const [review, setReview] = useState([]);
  const [sortOption, setSortOption] = useState("name");

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await axios.get("http://localhost:8081/reviews");
        setReview(res.data);
        applySorting(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllReviews();
  }, [sortOption]);

  const applySorting = (data) => {
    let sortedData = [...data];

    switch (sortOption) {
      case "idAsc":
        sortedData.sort((a, b) => a.review_id - b.review_id);
        break;
      case "idDesc":
        sortedData.sort((a, b) => b.review_id - a.review_id);
        break;
      default:
        break;
    }

    setReview(sortedData);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this review?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8081/reviews/" + id);
          Swal.fire("Deleted!", "This review has been deleted.", "success");
          window.location.reload();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the review.",
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
            <option value="idAsc">Review ID (Ascending)</option>
            <option value="idDesc">Review ID (Descending)</option>
          </select>
        </div>
      </div>

      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Review ID </td>
            <td> Comment </td>
            <td> Product </td>
            <td> Customer </td>
            <td> Order ID </td>
            <td> Order Item ID </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {review.map((data, i) => (
            <tr key={i}>
              <td>{data.review_id}</td>
              <td>{truncateText(data.review_comment, 50)}</td>
              <td>{data.product_id_fk}</td>
              <td>{data.customer_account_id_fk}</td>
              <td>{data.sales_order_id_fk}</td>
              <td>{data.sales_order_item_id_fk}</td>
              <td>
                <button
                  className="btn-red"
                  onClick={() => handleDelete(data.review_id)}
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

export default Review;
