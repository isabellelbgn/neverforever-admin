const Category = require("../models/categoryModel");

// Get all categories
const getCategories = (req, res) => {
  Category.getAllCategories((err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
};

// Create a category
const createCategory = (req, res) => {
  const categoryData = req.body;
  Category.createCategory(categoryData, (err, data) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(201).json(data);
  });
};

// Update a category
const updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const categoryData = req.body;

  Category.updateCategory(categoryId, categoryData, (err, data) => {
    if (err) {
      console.error("Error updating category:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
};

// Delete a category
const deleteCategory = (req, res) => {
  const categoryId = req.params.id;
  Category.deleteCategory(categoryId, (err, data) => {
    if (err) {
      console.error("Error deleting category:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
