const dbConnection = require("../config/db");

// Fetch all purchase orders
exports.getAllPurchaseOrders = () => {
  const sql = "SELECT * FROM purchase_order";
  return dbConnection.promise().query(sql);
};

// Insert a new purchase order
exports.addPurchaseOrder = (values) => {
  const sql =
    "INSERT INTO purchase_order (`po_orderDate`, `po_deliveryDate`, `po_totalAmount`, `supplier_id_fk`) VALUES (?, ?, ?, ?)";
  return dbConnection.promise().query(sql, values);
};

// Insert purchase order and sales order relationships
exports.addPurchaseOrderRelations = (relationsValues) => {
  const sql =
    "INSERT INTO purchase_order_sales_order (po_id_fk, so_id_fk) VALUES ?";
  return dbConnection.promise().query(sql, [relationsValues]);
};

// Get used sales orders
exports.getUsedSalesOrders = () => {
  const sql = "SELECT so_id_fk FROM purchase_order_sales_order";
  return dbConnection.promise().query(sql);
};

// Delete purchase order relationships by purchase order ID
exports.deletePurchaseOrderRelations = (purchaseOrderId) => {
  const sql = "DELETE FROM purchase_order_sales_order WHERE `po_id_fk` = ?";
  return dbConnection.promise().query(sql, [purchaseOrderId]);
};

// Delete purchase order by ID
exports.deletePurchaseOrder = (purchaseOrderId) => {
  const sql = "DELETE FROM purchase_order WHERE `po_id` = ?";
  return dbConnection.promise().query(sql, [purchaseOrderId]);
};

// Get a specific purchase order by ID
exports.getPurchaseOrderById = (purchaseOrderId) => {
  const sql = "SELECT * FROM purchase_order WHERE `po_id` = ?";
  return dbConnection.promise().query(sql, [purchaseOrderId]);
};

// Update a specific purchase order
exports.updatePurchaseOrder = (values, purchaseOrderId) => {
  const sql = `
    UPDATE purchase_order
    SET
      po_deliveryDate = ?,
      po_totalAmount = ?,
      supplier_id_fk = ?
    WHERE po_id = ?
  `;
  return dbConnection.promise().query(sql, [...values, purchaseOrderId]);
};
