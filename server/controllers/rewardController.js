const Reward = require("../models/rewardModel");

// Get all rewards
exports.getRewards = async (req, res) => {
  try {
    const [data] = await Reward.getAllRewards();
    res.json(data);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new reward
exports.addReward = async (req, res) => {
  try {
    const {
      customer_reward_name,
      customer_reward_code,
      customer_reward_percentage,
      customer_reward_validFrom,
      customer_reward_validUntil,
    } = req.body;

    const values = [
      customer_reward_name,
      customer_reward_code,
      customer_reward_percentage,
      customer_reward_validFrom,
      customer_reward_validUntil,
    ];

    const [data] = await Reward.addReward(values);
    res.json(data);
  } catch (err) {
    console.error("Error inserting into the database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a reward
exports.deleteReward = async (req, res) => {
  try {
    const rewardId = req.params.id;
    await Reward.deleteReward(rewardId);
    res.json("Reward has been deleted successfully.");
  } catch (err) {
    console.error("Error deleting reward:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a reward by ID
exports.getRewardById = async (req, res) => {
  try {
    const rewardId = req.params.id;
    const [data] = await Reward.getRewardById(rewardId);

    if (data.length === 0) {
      return res.status(404).json({ error: "Reward not found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error("Error fetching reward:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a reward
exports.updateReward = async (req, res) => {
  try {
    const rewardId = req.params.id;
    const {
      customerRewardName,
      customerRewardCode,
      customerRewardPercentage,
      customerRewardValidFrom,
      customerRewardValidUntil,
    } = req.body;

    const formattedValidFrom = new Date(customerRewardValidFrom)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const formattedValidUntil = new Date(customerRewardValidUntil)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const values = [
      customerRewardName,
      customerRewardCode,
      customerRewardPercentage,
      formattedValidFrom,
      formattedValidUntil,
    ];

    await Reward.updateReward(values, rewardId);
    res.json("Reward has been updated successfully.");
  } catch (err) {
    console.error("Error updating reward:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
