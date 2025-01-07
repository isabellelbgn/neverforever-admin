const dbConnection = require("../config/db");

// Get all discounts
const getAllDiscounts = (callback) => {
  const sql = "SELECT * FROM product_discount";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Get discount by Id
const getDiscountById = (discountId, callback) => {
  const sql = "SELECT * FROM product_discount WHERE `product_discount_id` = ?";
  dbConnection.query(sql, [discountId], (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Create a new discount
const createDiscount = (discountData, callback) => {
  const {
    product_discount_name,
    product_discount_code,
    product_discount_validFrom,
    product_discount_validUntil,
    product_discount_percentage,
  } = discountData;

  const sql =
    "INSERT INTO product_discount (`product_discount_name`, `product_discount_code`, `product_discount_validFrom`, `product_discount_validUntil`, `product_discount_percentage`) VALUES (?, ?, ?, ?, ?)";
  const values = [
    product_discount_name,
    product_discount_code,
    product_discount_validFrom,
    product_discount_validUntil,
    product_discount_percentage,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Update a discount
const updateDiscount = (discountId, discountData, callback) => {
  const {
    product_discount_name,
    product_discount_code,
    product_discount_validFrom,
    product_discount_validUntil,
    product_discount_percentage,
  } = discountData;

  const sql = `
    UPDATE product_discount
    SET
      product_discount_name = ?,
      product_discount_code = ?,
      product_discount_validFrom = ?,
      product_discount_validUntil = ?,
      product_discount_percentage = ?
    WHERE product_discount_id = ?
  `;
  const values = [
    product_discount_name,
    product_discount_code,
    product_discount_validFrom,
    product_discount_validUntil,
    product_discount_percentage,
    discountId,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Delete a discount by id
const deleteDiscountById = (discountId, callback) => {
  const sql = "DELETE FROM product_discount WHERE `product_discount_id` = ?";
  dbConnection.query(sql, [discountId], (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

module.exports = {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscountById,
};
