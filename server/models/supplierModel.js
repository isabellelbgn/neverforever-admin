const dbConnection = require("../config/db");

// Fetch all suppliers
exports.getAllSuppliers = () => {
  const sql = "SELECT * FROM supplier";
  return dbConnection.promise().query(sql);
};

// Insert a new supplier
exports.addSupplier = (values) => {
  const sql =
    "INSERT INTO supplier (`supplier_name`, `supplier_contactPerson`, `supplier_contactNumber`, `supplier_emailAddress`, `supplier_shippingAddress`) VALUES (?, ?, ?, ?, ?)";
  return dbConnection.promise().query(sql, values);
};

// Delete a supplier by ID
exports.deleteSupplier = (supplierId) => {
  const sql = "DELETE FROM supplier WHERE `supplier_id` = ?";
  return dbConnection.promise().query(sql, [supplierId]);
};

// Fetch a supplier by ID
exports.getSupplierById = (supplierId) => {
  const sql = "SELECT * FROM supplier WHERE `supplier_id` = ?";
  return dbConnection.promise().query(sql, [supplierId]);
};

// Update a supplier by ID
exports.updateSupplier = (values, supplierId) => {
  const sql = `
    UPDATE supplier
    SET
      supplier_name = ?,
      supplier_contactPerson = ?,
      supplier_contactNumber = ?,
      supplier_emailAddress = ?,
      supplier_shippingAddress = ?
    WHERE supplier_id = ?
  `;
  return dbConnection.promise().query(sql, [...values, supplierId]);
};
