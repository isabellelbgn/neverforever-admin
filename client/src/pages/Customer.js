import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Customer() {
  const [customer, setCustomer] = useState([]);
  const [rewardMapping, setRewardMapping] = useState({});
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchAllCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:8081/customers");
        setCustomer(res.data);

        const rewardResponse = await axios.get("http://localhost:8081/rewards");
        const rewards = rewardResponse.data;
        const rewardMap = {};
        rewards.forEach((reward) => {
          rewardMap[reward.customer_reward_id] = reward.customer_reward_code;
        });
        setRewardMapping(rewardMap);

        applySorting(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCustomers();
  }, [sortOption]);

  const applySorting = (data) => {
    let sortedData = [...data];

    switch (sortOption) {
      case "newest":
        sortedData.sort(
          (a, b) =>
            new Date(b.customer_account_registeredAt) -
            new Date(a.customer_account_registeredAt)
        );
        break;
      case "oldest":
        sortedData.sort(
          (a, b) =>
            new Date(a.customer_account_registeredAt) -
            new Date(b.customer_account_registeredAt)
        );
        break;
      case "lastName":
        sortedData.sort((a, b) =>
          a.customer_account_lastName.localeCompare(b.customer_account_lastName)
        );
        break;
      case "firstName":
        sortedData.sort((a, b) =>
          a.customer_account_firstName.localeCompare(
            b.customer_account_firstName
          )
        );
        break;
      case "customerIdAsc":
        sortedData.sort(
          (a, b) => a.customer_account_id - b.customer_account_id
        );
        break;
      case "customerIdDesc":
        sortedData.sort(
          (a, b) => b.customer_account_id - a.customer_account_id
        );
        break;
      default:
        break;
    }

    setCustomer(sortedData);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this customer?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8081/customers/" + id);
          Swal.fire("Deleted!", "This customer has been deleted.", "success");
          window.location.reload();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the customer.",
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
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="lastName">Last Name (A-Z)</option>
            <option value="firstName">First Name (A-Z)</option>
            <option value="customerIdAsc">Customer ID (Ascending)</option>
            <option value="customerIdDesc">Customer ID (Descending)</option>
          </select>
        </div>

        <div>
          <Link
            to="/customers/add"
            className="px-4 py-2 ml-5 rounded-md bg-black text-white inline-block"
          >
            Add +
          </Link>
        </div>
      </div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Customer ID </td>
            <td> Last Name </td>
            <td> First Name </td>
            <td> Email Address </td>
            <td> Username </td>
            <td> Status </td>
            <td> Rewards </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {customer.map((data, i) => (
            <tr key={i}>
              <td>{data.customer_account_id}</td>
              <td>{data.customer_account_firstName}</td>
              <td>{data.customer_account_lastName}</td>
              <td>{data.customer_account_emailAddress}</td>
              <td>{data.customer_account_username}</td>
              <td>{data.customer_account_status}</td>
              <td>{rewardMapping[data.customer_account_reward_id_fk]}</td>

              <td className="flex">
                <button className="btn-green">
                  <Link to={`/customers/update/${data.customer_account_id}`}>
                    <BiEdit />
                  </Link>
                </button>
                <button
                  className="btn-red"
                  onClick={() => handleDelete(data.customer_account_id)}
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

export default Customer;
