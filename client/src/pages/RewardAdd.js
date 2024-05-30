import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RewardAdd() {
  const [customerReward, setCustomerReward] = useState({
    customerRewardName: "",
    customerRewardCode: "",
    customerRewardPercentage: "",
    customerRewardValidFrom: "",
    customerRewardValidUntil: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCustomerReward((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const {
        customerRewardName,
        customerRewardCode,
        customerRewardPercentage,
        customerRewardValidFrom,
        customerRewardValidUntil,
      } = customerReward;
      await axios.post("http://localhost:8081/rewards", {
        customer_reward_name: customerRewardName,
        customer_reward_code: customerRewardCode,
        customer_reward_percentage: customerRewardPercentage,
        customer_reward_validFrom: customerRewardValidFrom,
        customer_reward_validUntil: customerRewardValidUntil,
      });
      navigate("/rewards");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold">
          {" "}
          Add Customer Reward{" "}
        </h1>

        <div className="mb-2">
          <label> Name</label>
          <input
            type="text"
            placeholder="Enter Reward Name"
            name="customerRewardName"
            onChange={handleChange}
          />
        </div>

        <label> Code</label>
        <input
          type="text"
          placeholder="Enter Reward Code"
          name="customerRewardCode"
          onChange={handleChange}
        />

        <label> Percentage </label>
        <input
          type="number"
          placeholder="Enter Reward Percentage"
          name="customerRewardPercentage"
          onChange={handleChange}
        />

        <label> Valid From </label>
        <input
          type="datetime-local"
          name="customerRewardValidFrom"
          onChange={handleChange}
        />

        <label> Valid Until </label>
        <input
          type="datetime-local"
          name="customerRewardValidUntil"
          onChange={handleChange}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            {" "}
            SAVE REWARD
          </button>
        </div>
      </form>
    </div>
  );
}

export default RewardAdd;
