const dbConnection = require("../config/db");

// Get count of orders for today
exports.getDayOrdersCount = (req, res) => {
  const dayOrdersCountQuery = `
    SELECT COUNT(*) AS count FROM sales_order
    WHERE DATE(so_orderDate) = CURDATE()
      AND so_orderStatus IN ('Delivered', 'Processing', 'Shipped', 'Return Requested', 'Refund Requested', 'Returned');
  `;
  dbConnection.query(dayOrdersCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
};

// Get count of orders for the current week
exports.getWeekOrdersCount = (req, res) => {
  const weekOrdersCountQuery = `
    SELECT COUNT(*) as count FROM sales_order
    WHERE YEARWEEK(DATE(so_orderDate), 1) = YEARWEEK(CURDATE(), 1)
    AND so_orderStatus IN ('Delivered', 'Processing', 'Shipped', 'Return Requested', 'Refund Requested', 'Returned');
  `;
  dbConnection.query(weekOrdersCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
};

// Get count of orders for the current month
exports.getMonthOrdersCount = (req, res) => {
  const monthOrdersCountQuery = `
    SELECT COUNT(*) as count FROM sales_order
    WHERE MONTH(so_orderDate) = MONTH(CURDATE()) AND YEAR(so_orderDate) = YEAR(CURDATE())
    AND so_orderStatus IN ('Delivered', 'Processing', 'Shipped', 'Return Requested', 'Refund Requested', 'Returned');
  `;
  dbConnection.query(monthOrdersCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
};

// Get total count of orders
exports.getTotalOrdersCount = (req, res) => {
  const ordersCountQuery = `
    SELECT COUNT(*) AS count FROM sales_order
    WHERE so_orderStatus IN ('Delivered', 'Processing', 'Shipped', 'Canceled', 'Refund Requested', 'Return Requested', 'Returned');
  `;
  dbConnection.query(ordersCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
};

// Get count of customers
exports.getCustomersCount = (req, res) => {
  const customersCountQuery = `
    SELECT COUNT(*) as count FROM customer_account;
  `;
  dbConnection.query(customersCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
};

// Get count of products
exports.getProductsCount = (req, res) => {
  const productCountQuery = `
    SELECT COUNT(*) as count FROM product;
  `;
  dbConnection.query(productCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
};

// Get count of pending orders
exports.getPendingOrdersCount = (req, res) => {
  const processingOrdersCountQuery = `
    SELECT COUNT(*) as count FROM sales_order
    WHERE so_orderStatus = 'Processing';
  `;
  dbConnection.query(processingOrdersCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
};

// Get count of completed orders
exports.getCompletedOrdersCount = (req, res) => {
  const processedOrdersCountQuery = `
    SELECT COUNT(*) as count FROM sales_order
    WHERE so_orderStatus IN ('Shipped', 'Delivered', 'Returned');
  `;
  dbConnection.query(processedOrdersCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
};

// Get count of requested orders
exports.getRequestedOrdersCount = (req, res) => {
  const requestedOrdersCountQuery = `
    SELECT COUNT(*) as count FROM sales_order
    WHERE so_orderStatus = 'Refund Requested' OR so_orderStatus = 'Return Requested';
  `;
  dbConnection.query(requestedOrdersCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
};

// Get recent activities for orders
exports.getRecentActivity = (req, res) => {
  const query = `
    SELECT so.*, sh.*, sa.*
    FROM sales_order AS so
    JOIN shipping AS sh ON so.shipping_id_fk = sh.shipping_id
    JOIN shipping_address AS sa ON sh.shipping_address_id_fk = sa.shipping_address_id
    ORDER BY so.so_orderDate DESC
    LIMIT 5;
  `;
  dbConnection.query(query, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
};
