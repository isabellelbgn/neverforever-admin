const dbConnection = require("../config/db");

// Get all orders
const getAllOrders = (callback) => {
  const query = `
    SELECT
      so.*,
      soi.*,
      p.*,
      sh.*,
      sa.*
    FROM sales_order AS so
    JOIN sales_order_item AS soi ON so.so_id = soi.so_id_fk
    JOIN product AS p ON soi.product_id_fk = p.product_id
    JOIN shipping AS sh ON so.shipping_id_fk = sh.shipping_id
    JOIN shipping_address AS sa ON sh.shipping_address_id_fk = sa.shipping_address_id;
  `;

  dbConnection.query(query, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Get order by id
const getOrderById = (orderId, callback) => {
  const query = `
    SELECT
      so.*,
      soi.*,
      p.*,
      sh.*,
      sa.*
    FROM sales_order AS so
    JOIN sales_order_item AS soi ON so.so_id = soi.so_id_fk
    JOIN product AS p ON soi.product_id_fk = p.product_id
    JOIN shipping AS sh ON so.shipping_id_fk = sh.shipping_id
    JOIN shipping_address AS sa ON sh.shipping_address_id_fk = sa.shipping_address_id
    WHERE so.so_id = ?;
  `;

  dbConnection.query(query, [orderId], (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Update an order
const updateOrder = (orderId, orderData, callback) => {
  const {
    soTotalAmount,
    soPaymentMethod,
    soPaymentStatus,
    soOrderStatus,
    soOrderNotes,
    soShippingId,
    soCustomerAccountId,
    soPaymentVerificationId,
    soDeliveryLogId,
  } = orderData;

  const updateQuery = `
    UPDATE sales_order
    SET
      so_totalAmount = ?,
      so_paymentMethod = ?,
      so_paymentStatus = ?,
      so_orderStatus = ?,
      so_orderNotes = ?,
      shipping_id_fk = ?,
      customer_account_id_fk = IF(? IS NOT NULL, ?, customer_account_id_fk),
      payment_verification_id_fk = IF(? IS NOT NULL, ?, payment_verification_id_fk),
      delivery_log_id_fk = IF(? IS NOT NULL, ?, delivery_log_id_fk),
      is_payment_locked = CASE
                            WHEN ? = 'Paid' THEN true
                            ELSE is_payment_locked
                          END,
      is_order_locked = CASE
                          WHEN ? = 'Shipped' THEN true
                          ELSE is_order_locked
                        END
    WHERE so_id = ?
  `;

  const updateValues = [
    soTotalAmount,
    soPaymentMethod,
    soPaymentStatus,
    soOrderStatus,
    soOrderNotes,
    soShippingId,
    soCustomerAccountId,
    soCustomerAccountId,
    soPaymentVerificationId,
    soPaymentVerificationId,
    soDeliveryLogId,
    soDeliveryLogId,
    soPaymentStatus,
    soOrderStatus,
    orderId,
  ];

  dbConnection.query(updateQuery, updateValues, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrder,
};
