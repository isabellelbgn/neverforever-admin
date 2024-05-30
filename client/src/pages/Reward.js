import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Reward() {
  const [customerReward, setCustomerReward] = useState([]);
  const [sortOption, setSortOption] = useState("name");

  useEffect(() => {
    const fetchAllCustomerRewards = async () => {
      try {
        const res = await axios.get("http://localhost:8081/rewards");
        setCustomerReward(res.data);
        applySorting(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCustomerRewards();
  }, [sortOption]);

  const applySorting = (data) => {
    let sortedData = [...data];

    switch (sortOption) {
      case "nameAsc":
        sortedData.sort((a, b) =>
          a.customer_reward_name.localeCompare(b.customer_reward_name)
        );
        break;
      case "nameDesc":
        sortedData.sort((a, b) =>
          b.customer_reward_name.localeCompare(a.customer_reward_name)
        );
        break;
      case "idAsc":
        sortedData.sort((a, b) => a.customer_reward_id - b.customer_reward_id);
        break;
      case "idDesc":
        sortedData.sort((a, b) => b.customer_reward_id - a.customer_reward_id);
        break;
      default:
        break;
    }

    setCustomerReward(sortedData);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this reward?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8081/rewards/" + id);
          Swal.fire("Deleted!", "Your reward has been deleted.", "success");
          window.location.reload();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the reward.",
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
            <option value="nameAsc">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
            <option value="idAsc">Customer Reward ID (Ascending)</option>
            <option value="idDesc">Customer Reward ID (Descending)</option>
          </select>
        </div>

        <div>
          <Link
            to="/rewards/add"
            className="px-4 py-2 ml-5 rounded-md bg-black text-white inline-block"
          >
            Add +
          </Link>
        </div>
      </div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Customer Reward ID </td>
            <td> Name </td>
            <td> Code </td>
            <td> Percentage </td>
            <td> Valid From </td>
            <td> Valid Until </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {customerReward.map((data, i) => (
            <tr key={i}>
              <td>{data.customer_reward_id}</td>
              <td>{data.customer_reward_name}</td>
              <td>{data.customer_reward_code}</td>
              <td>{data.customer_reward_percentage}</td>
              <td>{data.customer_reward_validFrom}</td>
              <td>{data.customer_reward_validUntil}</td>
              <td>
                <button className="btn-green">
                  <Link to={`/rewards/update/${data.customer_reward_id}`}>
                    <BiEdit />
                  </Link>
                </button>
                <button
                  className="btn-red"
                  onClick={() => handleDelete(data.customer_reward_id)}
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

export default Reward;
