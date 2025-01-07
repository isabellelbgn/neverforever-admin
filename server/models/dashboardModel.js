const dbConnection = require("../config/db");

module.exports = {
  getDayOrdersCount: (callback) => {
    const query = `
      SELECT COUNT(*) AS count 
      FROM sales_order 
      WHERE DATE(so_orderDate) = CURDATE() 
        AND so_orderStatus IN ('Delivered', 'Processing', 'Shipped', 'Return Requested', 'Refund Requested', 'Returned');
    `;
    dbConnection.query(query, callback);
  },

  getWeekOrdersCount: (callback) => {
    const query = `
      SELECT COUNT(*) as count 
      FROM sales_order 
      WHERE YEARWEEK(DATE(so_orderDate), 1) = YEARWEEK(CURDATE(), 1) 
        AND so_orderStatus IN ('Delivered', 'Processing', 'Shipped', 'Return Requested', 'Refund Requested', 'Returned');
    `;
    dbConnection.query(query, callback);
  },

  getMonthOrdersCount: (callback) => {
    const query = `
      SELECT COUNT(*) as count 
      FROM sales_order 
      WHERE MONTH(so_orderDate) = MONTH(CURDATE()) 
        AND YEAR(so_orderDate) = YEAR(CURDATE()) 
        AND so_orderStatus IN ('Delivered', 'Processing', 'Shipped', 'Return Requested', 'Refund Requested', 'Returned');
    `;
    dbConnection.query(query, callback);
  },

  getTotalOrdersCount: (callback) => {
    const query = `
      SELECT COUNT(*) AS count 
      FROM sales_order 
      WHERE so_orderStatus IN ('Delivered', 'Processing', 'Shipped', 'Canceled', 'Refund Requested', 'Return Requested', 'Returned');
    `;
    dbConnection.query(query, callback);
  },

  getCustomersCount: (callback) => {
    const query = `SELECT COUNT(*) as count FROM customer_account;`;
    dbConnection.query(query, callback);
  },

  getProductsCount: (callback) => {
    const query = `SELECT COUNT(*) as count FROM product;`;
    dbConnection.query(query, callback);
  },

  getPendingOrdersCount: (callback) => {
    const query = `
      SELECT COUNT(*) as count 
      FROM sales_order 
      WHERE so_orderStatus = 'Processing';
    `;
    dbConnection.query(query, callback);
  },

  getCompletedOrdersCount: (callback) => {
    const query = `
      SELECT COUNT(*) as count 
      FROM sales_order 
      WHERE so_orderStatus IN ('Shipped', 'Delivered', 'Returned');
    `;
    dbConnection.query(query, callback);
  },

  getRequestedOrdersCount: (callback) => {
    const query = `
      SELECT COUNT(*) as count 
      FROM sales_order 
      WHERE so_orderStatus = 'Refund Requested' OR so_orderStatus = 'Return Requested';
    `;
    dbConnection.query(query, callback);
  },

  getRecentActivity: (callback) => {
    const query = `
      SELECT so.*, sh.*, sa.*
      FROM sales_order AS so
      JOIN shipping AS sh ON so.shipping_id_fk = sh.shipping_id
      JOIN shipping_address AS sa ON sh.shipping_address_id_fk = sa.shipping_address_id
      ORDER BY so.so_orderDate DESC
      LIMIT 5;
    `;
    dbConnection.query(query, callback);
  },
};
