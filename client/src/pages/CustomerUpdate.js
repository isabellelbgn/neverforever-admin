import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function CustomerUpdate() {
  const [customer, setCustomer] = useState({
    customerFirstName: "",
    customerLastName: "",
    customerEmailAddress: "",
    customerUsername: "",
    customerPassword: "",
    customerStatus: "",
    customerRewardId: "",
    customerRegisteredAt: "",
  });

  const [errors, setErrors] = useState({});
  const [rewards, setRewards] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const customerId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/customers/${customerId}`
        );
        const customerData = response.data;

        setCustomer({
          customerFirstName: customerData.customer_account_firstName,
          customerLastName: customerData.customer_account_lastName,
          customerEmailAddress: customerData.customer_account_emailAddress,
          customerUsername: customerData.customer_account_username,
          customerPassword: customerData.customer_account_password,
          customerStatus: customerData.customer_account_status,
          customerRewardId: customerData.customer_reward_id,
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    fetchCustomerData();
  }, [customerId]);

  useEffect(() => {
    const fetchCustomerRewards = async () => {
      try {
        const response = await axios.get("http://localhost:8081/rewards");
        setRewards(response.data);
      } catch (error) {
        console.error("Error fetching customer rewards:", error);
      }
    };

    fetchCustomerRewards();
  }, []);

  useEffect(() => {
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      customerRegisteredAt: customer.customerRegisteredAt,
    }));
  }, []);

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!customer.customerFirstName) {
      newErrors.customerFirstName = "* The first name field is required.";
    }
    if (!customer.customerLastName) {
      newErrors.customerLastName = "* The last name field is required.";
    }
    if (!customer.customerEmailAddress) {
      newErrors.customerEmailAddress = "* The email address field is required.";
    }
    if (!customer.customerUsername) {
      newErrors.customerUsername = "* The username field is required.";
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
    if (!validateForm()) {
      return;
    }
    try {
      await axios.put(
        `http://localhost:8081/customers/update/${customerId}`,
        customer
      );
      navigate("/customers");
    } catch (err) {
      console.error("Error updating customer:", err);
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

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Update Customer </h1>

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
            value={customer.customerFirstName}
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
          value={customer.customerLastName}
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
          value={customer.customerEmailAddress}
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
          value={customer.customerUsername}
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
          value={customer.customerPassword}
          onChange={handleChange}
        />

        <label>
          Status
          {errors.customerStatus && (
            <span className="text-red-500 ml-2">{errors.customerStatus}</span>
          )}
        </label>
        <select
          name="customerStatus"
          value={customer.customerStatus}
          onChange={handleChange}
        >
          <option value=""></option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Closed">Closed</option>
        </select>

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

        <label> Registered At </label>
        <input
          type="datetime-local"
          name="customerRegisteredAt"
          value={customer.customerRegisteredAt}
          readOnly
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

export default CustomerUpdate;
