const dbConnection = require("../config/db");

// Fetch all customers
const getAllCustomers = () => {
  const sql = "SELECT * FROM customer_account";
  return dbConnection.promise().query(sql);
};

// Fetch a customer by ID
const getCustomerById = (id) => {
  const sql = "SELECT * FROM customer_account WHERE `customer_account_id` = ?";
  return dbConnection.promise().query(sql, [id]);
};

// Add a new customer
const addCustomer = (values) => {
  const sql = `
    INSERT INTO customer_account (
      customer_account_firstName,
      customer_account_lastName,
      customer_account_emailAddress,
      customer_account_username,
      customer_account_password,
      customer_account_status,
      customer_account_reward_id_fk,
      customer_account_registeredAt
    ) VALUES (?, ?, ?, ?, ?, ?, NULL, NOW())`;
  return dbConnection.promise().query(sql, values);
};

// Update a customer
const updateCustomer = (values) => {
  const sql = `
    UPDATE customer_account
    SET
      customer_account_firstName = ?,
      customer_account_lastName = ?,
      customer_account_emailAddress = ?,
      customer_account_username = ?,
      customer_account_password = ?,
      customer_account_status = ?,
      customer_account_reward_id_fk = ?
    WHERE customer_account_id = ?`;
  return dbConnection.promise().query(sql, values);
};

// Delete a customer
const deleteCustomer = (id) => {
  const sql = "DELETE FROM customer_account WHERE `customer_account_id` = ?";
  return dbConnection.promise().query(sql, [id]);
};

// Check duplicate username or email
const checkDuplicate = (column, value, excludeId = null) => {
  const sql = excludeId
    ? `SELECT COUNT(*) as count FROM customer_account WHERE ${column} = ? AND customer_account_id != ?`
    : `SELECT COUNT(*) as count FROM customer_account WHERE ${column} = ?`;
  return excludeId
    ? dbConnection.promise().query(sql, [value, excludeId])
    : dbConnection.promise().query(sql, [value]);
};

// Delete associated in-progress orders
const deleteInProgressOrders = (orderIds) => {
  const sql = "DELETE FROM sales_order WHERE so_id IN (?)";
  return dbConnection.promise().query(sql, [orderIds]);
};

// Get in-progress order IDs for a customer
const getInProgressOrderIds = (customerId) => {
  const sql = `
    SELECT so_id
    FROM sales_order
    WHERE customer_account_id_fk = ? AND so_orderStatus = 'In Progress'`;
  return dbConnection.promise().query(sql, [customerId]);
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  checkDuplicate,
  deleteInProgressOrders,
  getInProgressOrderIds,
};
