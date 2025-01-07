const Customer = require("../models/customerModel");
const bcrypt = require("bcrypt");

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const [data] = await Customer.getAllCustomers();
    res.json(data);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a customer by ID
const getCustomerById = async (req, res) => {
  try {
    const [data] = await Customer.getCustomerById(req.params.id);
    if (data.length === 0)
      return res.status(404).json({ error: "Customer not found" });
    res.json(data[0]);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new customer
const addCustomer = async (req, res) => {
  try {
    const {
      customer_account_firstName,
      customer_account_lastName,
      customer_account_emailAddress,
      customer_account_username,
      customer_account_password,
      customer_account_status,
    } = req.body;

    const hashedPassword = await bcrypt.hash(customer_account_password, 10);
    const values = [
      customer_account_firstName,
      customer_account_lastName,
      customer_account_emailAddress,
      customer_account_username,
      hashedPassword,
      customer_account_status,
    ];

    const [result] = await Customer.addCustomer(values);
    res.json(result);
  } catch (err) {
    console.error("Error adding customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  try {
    const {
      customerFirstName,
      customerLastName,
      customerEmailAddress,
      customerUsername,
      customerPassword,
      customerStatus,
      customerRewardId,
    } = req.body;

    const hashedPassword = customerPassword
      ? await bcrypt.hash(customerPassword, 10)
      : customerPassword;

    const values = [
      customerFirstName,
      customerLastName,
      customerEmailAddress,
      customerUsername,
      hashedPassword,
      customerStatus,
      customerRewardId,
      req.params.id,
    ];

    await Customer.updateCustomer(values);
    res.json("Customer has been updated successfully.");
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const [orderRows] = await Customer.getInProgressOrderIds(customerId);
    const inProgressOrderIds = orderRows.map((order) => order.so_id);

    if (inProgressOrderIds.length > 0) {
      await Customer.deleteInProgressOrders(inProgressOrderIds);
    }

    await Customer.deleteCustomer(customerId);
    res.json(
      "Customer and associated in-progress orders have been deleted successfully."
    );
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check duplicate
const checkDuplicate = async (req, res) => {
  try {
    const { username, email, currentCustomerId } = req.body;

    const [usernameRows] = await Customer.checkDuplicate(
      "customer_account_username",
      username,
      currentCustomerId
    );
    const [emailRows] = await Customer.checkDuplicate(
      "customer_account_emailAddress",
      email,
      currentCustomerId
    );

    res.json({
      usernameExists: usernameRows[0].count > 0,
      emailExists: emailRows[0].count > 0,
    });
  } catch (err) {
    console.error("Error checking duplicate:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  checkDuplicate,
};
