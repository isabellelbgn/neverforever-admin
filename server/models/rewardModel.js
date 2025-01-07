const dbConnection = require("../config/db");

// Fetch all rewards
exports.getAllRewards = () => {
  const sql = "SELECT * FROM customer_reward";
  return dbConnection.promise().query(sql);
};

// Insert a new reward
exports.addReward = (values) => {
  const sql =
    "INSERT INTO customer_reward (`customer_reward_name`, `customer_reward_code`, `customer_reward_percentage`, `customer_reward_validFrom`, `customer_reward_validUntil`) VALUES (?, ?, ?, ?, ?)";
  return dbConnection.promise().query(sql, values);
};

// Delete a reward by ID
exports.deleteReward = (rewardId) => {
  const sql = "DELETE FROM customer_reward WHERE `customer_reward_id` = ?";
  return dbConnection.promise().query(sql, [rewardId]);
};

// Fetch a reward by ID
exports.getRewardById = (rewardId) => {
  const sql = "SELECT * FROM customer_reward WHERE `customer_reward_id` = ?";
  return dbConnection.promise().query(sql, [rewardId]);
};

// Update a reward by ID
exports.updateReward = (values, rewardId) => {
  const sql = `
    UPDATE customer_reward
    SET
      customer_reward_name = ?,
      customer_reward_code = ?,
      customer_reward_percentage = ?,
      customer_reward_validFrom = ?,
      customer_reward_validUntil = ?
    WHERE customer_reward_id = ?
  `;
  return dbConnection.promise().query(sql, [...values, rewardId]);
};
