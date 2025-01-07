const Discount = require("../models/discountModel");

// Get all discounts
const getDiscounts = (req, res) => {
  Discount.getAllDiscounts((err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
};

// Get discount by id
const getDiscountById = (req, res) => {
  const discountId = req.params.id;
  Discount.getDiscountById(discountId, (err, data) => {
    if (err) {
      console.error("Error fetching discount:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Discount not found" });
    }
    return res.json(data[0]);
  });
};

// Add a new discount
const createDiscount = (req, res) => {
  const discountData = req.body;
  Discount.createDiscount(discountData, (err, data) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(201).json(data);
  });
};

// Update a discount
const updateDiscount = (req, res) => {
  const discountId = req.params.id;
  const discountData = req.body;

  Discount.updateDiscount(discountId, discountData, (err, data) => {
    if (err) {
      console.error("Error updating discount:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json("Discount has been updated successfully.");
  });
};

// Delete a discount
const deleteDiscount = (req, res) => {
  const discountId = req.params.id;
  Discount.deleteDiscountById(discountId, (err, data) => {
    if (err) {
      console.error("Error deleting discount:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json("Discount has been deleted successfully.");
  });
};

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
