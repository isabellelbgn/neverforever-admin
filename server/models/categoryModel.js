const dbConnection = require("../config/db");

// Get all categories
const getAllCategories = (callback) => {
  const sql = "SELECT * FROM product_category";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Create a new category
const createCategory = (categoryData, callback) => {
  const { product_category_name } = categoryData;
  const sql =
    "INSERT INTO product_category (`product_category_name`) VALUES (?)";
  const values = [product_category_name];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Update a category
const updateCategory = (categoryId, categoryData, callback) => {
  const { product_category_name } = categoryData;
  const sql =
    "UPDATE product_category SET `product_category_name` = ? WHERE `product_category_id` = ?";
  const values = [product_category_name, categoryId];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Delete a category
const deleteCategory = (categoryId, callback) => {
  const sql = "DELETE FROM product_category WHERE `product_category_id` = ?";
  dbConnection.query(sql, [categoryId], (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
