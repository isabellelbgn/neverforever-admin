const Order = require("../models/orderModel");

// Get all orders
const getOrders = (req, res) => {
  Order.getAllOrders((err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
};

// Get order by id
const getOrderById = (req, res) => {
  const orderId = req.params.id;
  Order.getOrderById(orderId, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const adminId = req.session.adminId;

    const orderData = req.body;

    Order.updateOrder(orderId, orderData, (err, data) => {
      if (err) {
        console.error("Error updating order:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({ message: "Order updated successfully." });
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrder,
};
