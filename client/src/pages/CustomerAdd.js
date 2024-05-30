import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CustomerAdd() {
  const [customer, setCustomer] = useState({
    customerFirstName: "",
    customerLastName: "",
    customerEmailAddress: "",
    customerUsername: "",
    customerPassword: "",
    customerStatus: "",
    customerRegisteredAt: "",
    customerRewardId: "",
  });

  const [errors, setErrors] = useState({});
  const [rewards, setRewards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerRewards();
  }, []);

  const fetchCustomerRewards = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/rewards`);
      setRewards(response.data);
    } catch (err) {
      console.error("Error fetching customer rewards:", err);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = `${currentDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${currentDate.getDate()}`.padStart(2, "0");
    const hours = `${currentDate.getHours()}`.padStart(2, "0");
    const minutes = `${currentDate.getMinutes()}`.padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      customerRegisteredAt: formattedDate,
    }));
  }, []);

  const handleChange = (e) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = async () => {
    const newErrors = { ...errors };

    if (!customer.customerFirstName) {
      newErrors.customerFirstName = "* The first name field is required.";
    }
    if (!customer.customerLastName) {
      newErrors.customerLastName = "* The last name field is required.";
    }
    if (!customer.customerEmailAddress) {
      newErrors.customerEmailAddress = "* The email address field is required.";
    } else {
      const { data } = await axios.post(
        "http://localhost:8081/checkCustomerDuplicate",
        {
          email: customer.customerEmailAddress,
        }
      );

      if (data.emailExists) {
        newErrors.customerEmailAddress =
          "* This email address is already taken.";
      }
    }
    if (!customer.customerUsername) {
      newErrors.customerUsername = "* The username field is required.";
    } else {
      const { data } = await axios.post(
        "http://localhost:8081/checkCustomerDuplicate",
        {
          username: customer.customerUsername,
        }
      );

      if (data.usernameExists) {
        newErrors.customerUsername = "* This username is already taken.";
      }
    }
    if (!customer.customerPassword) {
      newErrors.customerPassword = "* The password field is required.";
    }
    if (!customer.customerStatus) {
      newErrors.customerStatus = "* The status field is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) {
      return;
    }
    try {
      const {
        customerFirstName,
        customerLastName,
        customerEmailAddress,
        customerUsername,
        customerPassword,
        customerStatus,
        customerRegisteredAt,
        customerRewardId,
      } = customer;
      await axios.post("http://localhost:8081/customers", {
        customer_account_firstName: customerFirstName,
        customer_account_lastName: customerLastName,
        customer_account_emailAddress: customerEmailAddress,
        customer_account_username: customerUsername,
        customer_account_password: customerPassword,
        customer_account_status: customerStatus,
        customer_account_registeredAt: customerRegisteredAt,
        customer_account_reward_id_fk: customerRewardId,
      });
      navigate("/customers");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Add Customer </h1>

        <div className="mb-2">
          <label>
            First Name
            {errors.customerFirstName && (
              <span className="text-red-500 ml-2">
                {errors.customerFirstName}
              </span>
            )}
          </label>
          <input
            type="text"
            placeholder="Enter First Name"
            name="customerFirstName"
            onChange={handleChange}
          />
        </div>

        <label>
          Last Name
          {errors.customerLastName && (
            <span className="text-red-500 ml-2">{errors.customerLastName}</span>
          )}
        </label>
        <input
          type="text"
          placeholder="Enter Last Name"
          name="customerLastName"
          onChange={handleChange}
        />

        <label>
          Email Address
          {errors.customerEmailAddress && (
            <span className="text-red-500 ml-2">
              {errors.customerEmailAddress}
            </span>
          )}
        </label>
        <input
          type="text"
          placeholder="Enter Email Address"
          name="customerEmailAddress"
          onChange={handleChange}
        />

        <label>
          Username
          {errors.customerUsername && (
            <span className="text-red-500 ml-2">{errors.customerUsername}</span>
          )}
        </label>
        <input
          type="text"
          placeholder="Enter Username"
          name="customerUsername"
          onChange={handleChange}
        />

        <label>
          Password
          {errors.customerPassword && (
            <span className="text-red-500 ml-2">{errors.customerPassword}</span>
          )}
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="customerPassword"
          onChange={handleChange}
        />

        <label>
          Status
          {errors.customerStatus && (
            <span className="text-red-500 ml-2">{errors.customerStatus}</span>
          )}
        </label>
        <select name="customerStatus" onChange={handleChange}>
          <option value=""></option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Closed">Closed</option>
        </select>

        <div className="mb-2">
          <label>Customer Reward</label>
          <select
            name="customerRewardId"
            onChange={handleChange}
            value={customer.customerRewardId}
          >
            <option value=""></option>
            {rewards.map((reward) => (
              <option
                key={reward.customer_reward_id}
                value={reward.customer_reward_id}
              >
                {reward.customer_reward_code}
              </option>
            ))}
          </select>
        </div>

        <label> Registered At </label>
        <input
          type="datetime-local"
          name="customerRegisteredAt"
          value={customer.customerRegisteredAt}
          onChange={handleChange}
          disabled
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            {" "}
            SAVE CUSTOMER
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerAdd;
