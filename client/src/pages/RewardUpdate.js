import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function RewardUpdate() {
  const [customerReward, setCustomerReward] = useState({
    customerRewardName: "",
    customerRewardCode: "",
    customerRewardPercentage: "",
    customerRewardValidFrom: "",
    customerRewardValidUntil: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const customerRewardId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchCustomerRewardData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/rewards/${customerRewardId}`
        );
        const customerRewardData = response.data;

        setCustomerReward({
          customerRewardName: customerRewardData.customer_reward_name,
          customerRewardCode: customerRewardData.customer_reward_code,
          customerRewardPercentage:
            customerRewardData.customer_reward_percentage,
          customerRewardValidFrom: customerRewardData.customer_reward_validFrom,
          customerRewardValidUntil:
            customerRewardData.customer_reward_validUntil,
        });
      } catch (error) {
        console.error("Error fetching reward data:", error);
      }
    };
    fetchCustomerRewardData();
  }, [customerRewardId]);

  const handleChange = (e) => {
    setCustomerReward({
      ...customerReward,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    if (!customerReward.customerRewardName) {
      newErrors.customerRewardName = "* The reward name field is required.";
    }
    if (!customerReward.customerRewardCode) {
      newErrors.customerRewardCode = "* The reward code field is required.";
    }
    if (!customerReward.customerRewardPercentage) {
      newErrors.customerRewardPercentage =
        "* The reward percentage field is required.";
    }
    if (!customerReward.customerRewardValidFrom) {
      newErrors.customerRewardValidFrom = "* The valid from field is required.";
    }
    if (!customerReward.customerRewardValidUntil) {
      newErrors.customerRewardValidUntil =
        "* The valid until field is required.";
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
        `http://localhost:8081/rewards/update/${customerRewardId}`,
        customerReward
      );
      navigate("/rewards");
    } catch (err) {
      console.error("Error updating reward:", err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold">
          {" "}
          Update Customer Reward{" "}
        </h1>

        <div className="mb-2">
          <label>
            Name
            {errors.customerRewardName && (
              <span className="text-red-500 ml-2">
                {errors.customerRewardName}
              </span>
            )}
          </label>
          <input
            type="text"
            placeholder="Enter Reward Name"
            name="customerRewardName"
            value={customerReward.customerRewardName}
            onChange={handleChange}
          />
        </div>

        <label>
          Code
          {errors.customerRewardCode && (
            <span className="text-red-500 ml-2">
              {errors.customerRewardCode}
            </span>
          )}
        </label>
        <input
          type="text"
          placeholder="Enter Reward Code"
          name="customerRewardCode"
          value={customerReward.customerRewardCode}
          onChange={handleChange}
        />

        <label>
          Percentage
          {errors.customerRewardPercentage && (
            <span className="text-red-500 ml-2">
              {errors.customerRewardPercentage}
            </span>
          )}
        </label>
        <input
          type="number"
          placeholder="Enter Reward Percentage"
          name="customerRewardPercentage"
          value={customerReward.customerRewardPercentage}
          onChange={handleChange}
        />

        <label>
          Valid From
          {errors.customerRewardValidFrom && (
            <span className="text-red-500 ml-2">
              {errors.customerRewardValidFrom}
            </span>
          )}
        </label>
        <input
          type="datetime-local"
          name="customerRewardValidFrom"
          value={customerReward.customerRewardValidFrom || ""}
          onChange={handleChange}
        />

        <label>
          Valid Until
          {errors.customerRewardValidUntil && (
            <span className="text-red-500 ml-2">
              {errors.customerRewardValidUntil}
            </span>
          )}
        </label>
        <input
          type="datetime-local"
          name="customerRewardValidUntil"
          value={customerReward.customerRewardValidUntil}
          onChange={handleChange}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            SAVE REWARD
          </button>
        </div>
      </form>
    </div>
  );
}

export default RewardUpdate;
