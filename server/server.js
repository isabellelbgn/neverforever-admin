const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const salt = 10;
const dbConnection = require("./db.js");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionStoreAdmin = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
});

app.use(
  session({
    name: "adminId",
    secret: "N4EAGL",
    resave: false,
    saveUninitialized: true,
    store: sessionStoreAdmin,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// CUSTOMERS
app.get("/customers", (req, res) => {
  const sql = "SELECT * FROM customer_account";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/customers", async (req, res) => {
  try {
    const {
      customer_account_firstName,
      customer_account_lastName,
      customer_account_emailAddress,
      customer_account_username,
      customer_account_password,
      customer_account_status,
      customer_account_reward_id_fk,
      customer_account_registeredAt,
    } = req.body;

    const hashedPassword = await bcrypt.hash(customer_account_password, 10);

    const sql =
      "INSERT INTO customer_account (`customer_account_firstName`, `customer_account_lastName`, `customer_account_emailAddress`, `customer_account_username`, `customer_account_password`, `customer_account_status`, `customer_account_reward_id_fk`, `customer_account_registeredAt`) VALUES (?, ?, ?, ?, ?, ?, NULL, NOW())";
    const values = [
      customer_account_firstName,
      customer_account_lastName,
      customer_account_emailAddress,
      customer_account_username,
      hashedPassword,
      customer_account_status,
      customer_account_reward_id_fk,
      customer_account_registeredAt,
      ,
    ];

    dbConnection.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error inserting into the database:", err);
        return res.json("Error");
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/customers/:id", async (req, res) => {
  const customersId = req.params.id;
  try {
    const fetchInProgressOrders = `
    SELECT so_id
    FROM sales_order
    WHERE customer_account_id_fk = ? AND so_orderStatus = 'In Progress';
  `;

    const [orderRows] = await dbConnection
      .promise()
      .query(fetchInProgressOrders, [customersId]);

    const inProgressOrderIds = orderRows.map((order) => order.so_id);

    const deleteInProgressOrders = `
    DELETE FROM sales_order
    WHERE so_id IN (?);
  `;
    if (inProgressOrderIds.length > 0) {
      await dbConnection
        .promise()
        .query(deleteInProgressOrders, [inProgressOrderIds]);
    }

    const deleteCustomer =
      "DELETE FROM customer_account WHERE `customer_account_id` = ?";
    await dbConnection.promise().query(deleteCustomer, [customersId]);

    return res.json(
      "Customer and associated in progress orders have been deleted successfully."
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/customers/:id", (req, res) => {
  const customersId = req.params.id;
  const sql = "SELECT * FROM customer_account WHERE `customer_account_id` = ?";

  dbConnection.query(sql, [customersId], (err, data) => {
    if (err) {
      console.error("Error fetching customers:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Customers not found" });
    }
    res.json(data[0]);
  });
});

app.put("/customers/update/:id", async (req, res) => {
  try {
    const customersId = req.params.id;
    const {
      customerFirstName,
      customerLastName,
      customerEmailAddress,
      customerUsername,
      customerPassword,
      customerStatus,
      customerRewardId,
    } = req.body;

    // Check if the password is provided
    let hashedPassword = customerPassword;
    if (customerPassword) {
      hashedPassword = await bcrypt.hash(customerPassword, 10);
    }

    const sql = `
      UPDATE customer_account
      SET
        customer_account_firstName = ?,
        customer_account_lastName = ?,
        customer_account_emailAddress = ?,
        customer_account_username = ?,
        customer_account_password = ?,
        customer_account_status = ?,
        customer_account_reward_id_fk = ?
      WHERE customer_account_id = ?
    `;

    const values = [
      customerFirstName,
      customerLastName,
      customerEmailAddress,
      customerUsername,
      hashedPassword,
      customerStatus,
      customerRewardId,
      customersId,
    ];

    dbConnection.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error updating customer:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json("Customer has been updated successfully.");
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/checkCustomerDuplicate", async (req, res) => {
  try {
    const { username, email } = req.body;

    const usernameQuery =
      "SELECT COUNT(*) as count FROM customer_account WHERE customer_account_username = ?";
    const [usernameRows] = await dbConnection
      .promise()
      .query(usernameQuery, [username]);
    const usernameCount = usernameRows[0].count;

    const emailQuery =
      "SELECT COUNT(*) as count FROM customer_account WHERE customer_account_emailAddress = ?";
    const [emailRows] = await dbConnection.promise().query(emailQuery, [email]);
    const emailCount = emailRows[0].count;

    res.json({
      usernameExists: usernameCount > 0,
      emailExists: emailCount > 0,
    });
  } catch (error) {
    console.error("Error checking duplicate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/checkCustomerUpdateDuplicate", async (req, res) => {
  try {
    const { username, email, currentCustomerId } = req.body;

    const usernameQuery =
      "SELECT COUNT(*) as count FROM customer_account WHERE customer_account_username = ? AND customer_account_id != ?";
    const [usernameRows] = await dbConnection
      .promise()
      .query(usernameQuery, [username, currentCustomerId]);
    const usernameCount = usernameRows[0].count;

    const emailQuery =
      "SELECT COUNT(*) as count FROM customer_account WHERE customer_account_emailAddress = ? AND customer_account_id != ?";
    const [emailRows] = await dbConnection
      .promise()
      .query(emailQuery, [email, currentCustomerId]);
    const emailCount = emailRows[0].count;

    res.json({
      usernameExists: usernameCount > 0,
      emailExists: emailCount > 0,
    });
  } catch (error) {
    console.error("Error checking duplicate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// REWARDS
app.get("/rewards", (req, res) => {
  const sql = "SELECT * FROM customer_reward";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/rewards", (req, res) => {
  const sql =
    "INSERT INTO customer_reward (`customer_reward_name`, `customer_reward_code`, `customer_reward_percentage`, `customer_reward_validFrom`, `customer_reward_validUntil`) VALUES (?, ?, ?, ?, ?)";
  const values = [
    req.body.customer_reward_name,
    req.body.customer_reward_code,
    req.body.customer_reward_percentage,
    req.body.customer_reward_validFrom,
    req.body.customer_reward_validUntil,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.delete("/rewards/:id", (req, res) => {
  const customerRewardId = req.params.id;
  const sql = "DELETE FROM customer_reward WHERE `customer_reward_id` = ?";
  dbConnection.query(sql, [customerRewardId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Reward has been deleted successfully.");
  });
});

app.get("/rewards/:id", (req, res) => {
  const customerRewardId = req.params.id;
  const sql = "SELECT * FROM customer_reward WHERE `customer_reward_id` = ?";

  dbConnection.query(sql, [customerRewardId], (err, data) => {
    if (err) {
      console.error("Error fetching reward:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Reward not found" });
    }
    res.json(data[0]);
  });
});

app.put("/rewards/update/:id", (req, res) => {
  const customerRewardId = req.params.id;
  const {
    customerRewardName,
    customerRewardCode,
    customerRewardPercentage,
    customerRewardValidFrom,
    customerRewardValidUntil,
  } = req.body;

  const formattedValidFrom = new Date(customerRewardValidFrom)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const formattedValidUntil = new Date(customerRewardValidUntil)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const sql = `
    UPDATE customer_reward
    SET
      customer_reward_name = ?,
      customer_reward_code = ?,
      customer_reward_percentage = ?,
      customer_reward_validFrom = ?,
      customer_reward_validUntil = ?
    WHERE customer_reward_id = ?
  `;
  const values = [
    customerRewardName,
    customerRewardCode,
    customerRewardPercentage,
    formattedValidFrom,
    formattedValidUntil,
    customerRewardId,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error updating reward:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json("Reward has been updated successfully.");
  });
});

// SUPPLIERS
app.get("/suppliers", (req, res) => {
  const sql = "SELECT * FROM supplier";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/suppliers", (req, res) => {
  const sql =
    "INSERT INTO supplier (`supplier_name`, `supplier_contactPerson`, `supplier_contactNumber`, `supplier_emailAddress`, `supplier_shippingAddress`) VALUES (?, ?, ?, ?, ?)";
  const values = [
    req.body.supplier_name,
    req.body.supplier_contactPerson,
    req.body.supplier_contactNumber,
    req.body.supplier_contactNumber,
    req.body.supplier_shippingAddress,
  ];
  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.delete("/suppliers/:id", (req, res) => {
  const supplierId = req.params.id;
  const sql = "DELETE FROM supplier WHERE `supplier_id` = ?";
  dbConnection.query(sql, [supplierId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Supplier has been deleted successfully.");
  });
});

app.get("/suppliers/:id", (req, res) => {
  const supplierId = req.params.id;
  const sql = "SELECT * FROM supplier WHERE `supplier_id` = ?";

  dbConnection.query(sql, [supplierId], (err, data) => {
    if (err) {
      console.error("Error fetching supplier:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(data[0]);
  });
});

app.put("/suppliers/update/:id", (req, res) => {
  const supplierId = req.params.id;
  const {
    supplierName,
    supplierContactPerson,
    supplierContactNumber,
    supplierEmailAddress,
    supplierShippingAddress,
  } = req.body;

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
  const values = [
    supplierName,
    supplierContactPerson,
    supplierContactNumber,
    supplierEmailAddress,
    supplierShippingAddress,
    supplierId,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error updating supplier:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json("Supplier has been updated successfully.");
  });
});

// PURCHASE ORDERS
app.get("/purchaseorders", (req, res) => {
  const sql = "SELECT * FROM purchase_order";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/purchaseorders", async (req, res) => {
  try {
    const {
      po_orderDate,
      po_deliveryDate,
      po_totalAmount,
      supplier_id_fk,
      salesOrderIds,
    } = req.body;

    const purchaseOrderInsertQuery =
      "INSERT INTO purchase_order (`po_orderDate`, `po_deliveryDate`, `po_totalAmount`, `supplier_id_fk`) VALUES (?, ?, ?, ?)";
    const purchaseOrderValues = [
      po_orderDate,
      po_deliveryDate || null,
      po_totalAmount,
      supplier_id_fk,
    ];

    const [purchaseOrderResult] = await dbConnection
      .promise()
      .query(purchaseOrderInsertQuery, purchaseOrderValues);
    const po_id = purchaseOrderResult.insertId;

    if (salesOrderIds && salesOrderIds.length > 0) {
      const insertRelationsQuery =
        "INSERT INTO purchase_order_sales_order (po_id_fk, so_id_fk) VALUES ?";
      const relationsValues = salesOrderIds.map((so_id) => [po_id, so_id]);

      await dbConnection
        .promise()
        .query(insertRelationsQuery, [relationsValues]);
    }

    res.json({ message: "Purchase Order added successfully." });
  } catch (error) {
    console.error("Error adding purchase order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/purchaseorders/usedsalesorders", async (req, res) => {
  try {
    const [rows] = await dbConnection
      .promise()
      .query("SELECT so_id_fk FROM purchase_order_sales_order");

    const usedSalesOrders = rows.map((row) => row.so_id_fk);

    res.json(usedSalesOrders);
  } catch (error) {
    console.error("Error fetching used sales orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/purchaseorders/:id", (req, res) => {
  const purchaseOrderId = req.params.id;
  console.log(purchaseOrderId);
  const deleteRelationsQuery =
    "DELETE FROM purchase_order_sales_order WHERE `po_id_fk` = ?";
  dbConnection.query(deleteRelationsQuery, [purchaseOrderId], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    const deletePurchaseOrderQuery =
      "DELETE FROM purchase_order WHERE `po_id` = ?";
    dbConnection.query(
      deletePurchaseOrderQuery,
      [purchaseOrderId],
      (err, data) => {
        if (err) {
          return res.status(500).json(err);
        }

        return res.json(
          "Purchase Order and related records deleted successfully."
        );
      }
    );
  });
});

app.get("/purchaseorders/:id", (req, res) => {
  const purchaseOrderId = req.params.id;
  const sql = "SELECT * FROM purchase_order WHERE `po_id` = ?";

  dbConnection.query(sql, [purchaseOrderId], (err, data) => {
    if (err) {
      console.error("Error fetching purchase order:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Purchase Order not found" });
    }
    res.json(data[0]);
  });
});

app.put("/purchaseorders/update/:id", (req, res) => {
  const purchaseOrderId = req.params.id;
  const { purchaseOrderDeliveryDate, purchaseOrderTotalAmount, supplierId } =
    req.body;

  const sql = `
  UPDATE purchase_order
  SET
  po_deliveryDate = ?,
  po_totalAmount = ?,
  supplier_id_fk = ?
  WHERE po_id = ?
`;
  const values = [
    purchaseOrderDeliveryDate || null,
    purchaseOrderTotalAmount,
    supplierId,
    purchaseOrderId,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error updating purchase order:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json("Purchase Order has been updated successfully.");
  });
});

// PRODUCTS
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM product";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/products", (req, res) => {
  const {
    product_name,
    product_jewelryTone,
    product_description,
    product_category_id_fk,
    product_supplierPrice,
    product_unitPrice,
    product_availabilityStatus,
    productImages,
    product_createdAt,
    supplier_id_fk,
    product_discount_id_fk,
  } = req.body;

  const sql = `
    INSERT INTO product (
      product_name,
      product_jewelryTone,
      product_description,
      product_category_id_fk,
      product_supplierPrice,
      product_unitPrice,
      product_availabilityStatus,
      product_image,
      product_createdAt,
      supplier_id_fk,
      product_discount_id_fk
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    product_name,
    product_jewelryTone,
    product_description,
    product_category_id_fk,
    product_supplierPrice,
    product_unitPrice,
    product_availabilityStatus,
    productImages,
    product_createdAt,
    supplier_id_fk,
    product_discount_id_fk || null,
  ];

  dbConnection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting product into the database:", err);
      return res.status(500).json({ message: "Error" });
    }

    return res.json({ message: "Product and images added successfully" });
  });
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const sql = "SELECT * FROM product WHERE `product_id` = ?";

  dbConnection.query(sql, [productId], (err, data) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(data[0]);
  });
});

app.put("/products/update/:id", (req, res) => {
  const productId = req.params.id;
  const {
    productName,
    productJewelryTone,
    productImages,
    productDescription,
    productUnitPrice,
    productAvailabilityStatus,
    productCategoryId,
    productCreatedAt,
    supplierId,
    productDiscountId,
  } = req.body;

  const sql = `
    UPDATE product
    SET
      product_name = ?,
      product_jewelryTone = ?,
      product_image = ?,
      product_category_id_fk = ?,
      product_description = ?,
      product_unitPrice = ?,
      product_availabilityStatus = ?,
      product_createdAt = ?,
      supplier_id_fk = ?,
      product_discount_id_fk = ?
    WHERE product_id = ?
    `;

  const values = [
    productName,
    productJewelryTone,
    productImages,
    productCategoryId,
    productDescription,
    productUnitPrice,
    productAvailabilityStatus,
    productCreatedAt,
    supplierId,
    productDiscountId,
    productId,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json("Product has been updated successfully.");
  });
});

app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;
  const sql = "DELETE FROM product WHERE `product_id` = ?";
  dbConnection.query(sql, [productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product has been deleted successfully.");
  });
});

app.post("/products/add/upload", upload.array("file", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadedImages = req.files.map((file) => file.filename);
  return res.json({ message: "Images uploaded", images: uploadedImages });
});

app.delete("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "public/images", filename);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting image:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json({ message: "Image deleted successfully" });
  });
});

// REVIEWS
app.get("/reviews", (req, res) => {
  const sql = "SELECT * FROM review";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.delete("/reviews/:id", (req, res) => {
  const reviewId = req.params.id;
  const sql = "DELETE FROM review WHERE `review_id` = ?";
  dbConnection.query(sql, [reviewId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Discount has been deleted successfully.");
  });
});

app.get("/reviews/:id", (req, res) => {
  const reviewId = req.params.id;
  const sql = "SELECT * FROM review WHERE `review_id` = ?";

  dbConnection.query(sql, [reviewId], (err, data) => {
    if (err) {
      console.error("Error fetching review:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(data[0]);
  });
});

app.put("/reviews/update/:id", (req, res) => {
  const reviewId = req.params.id;
  const { reviewComment, reviewProduct, reviewCustomer, reviewSO, reviewSOI } =
    req.body;

  const sql = `
      UPDATE review
      SET
      review_comment = ?,
      product_id_fk = ?,
      customer_account_id_fk = ?,
      sales_order_id_fk = ?,
      sales_order_item_id_fk = ?
      WHERE review_id = ?
    `;
  const values = [
    reviewComment,
    reviewProduct,
    reviewCustomer,
    reviewSO,
    reviewSOI,
    reviewId,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error updating review:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json("Review has been updated successfully.");
  });
});

// DISCOUNTS
app.get("/discounts", (req, res) => {
  const sql = "SELECT * FROM product_discount";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/discounts", (req, res) => {
  const sql =
    "INSERT INTO product_discount (`product_discount_name`, `product_discount_code`, `product_discount_validFrom`, `product_discount_validUntil`, `product_discount_percentage`) VALUES (?, ?, ?, ?, ?)";
  const values = [
    req.body.product_discount_name,
    req.body.product_discount_code,
    req.body.product_discount_validFrom,
    req.body.product_discount_validUntil,
    req.body.product_discount_percentage,
  ];
  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.delete("/discounts/:id", (req, res) => {
  const discountsId = req.params.id;
  const sql = "DELETE FROM product_discount WHERE `product_discount_id` = ?";
  dbConnection.query(sql, [discountsId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Discount has been deleted successfully.");
  });
});

app.get("/discounts/:id", (req, res) => {
  const productDiscountId = req.params.id;
  const sql = "SELECT * FROM product_discount WHERE `product_discount_id` = ?";

  dbConnection.query(sql, [productDiscountId], (err, data) => {
    if (err) {
      console.error("Error fetching discount:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Discount not found" });
    }
    res.json(data[0]);
  });
});

app.put("/discounts/update/:id", (req, res) => {
  const productDiscountId = req.params.id;
  const {
    productDiscountName,
    productDiscountCode,
    productDiscountValidFrom,
    productDiscountValidUntil,
    productDiscountPercentage,
  } = req.body;

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
    productDiscountName,
    productDiscountCode,
    productDiscountValidFrom,
    productDiscountValidUntil,
    productDiscountPercentage,
    productDiscountId,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error updating discount:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json("Discount has been updated successfully.");
  });
});

// CATEGORIES
app.get("/categories", (req, res) => {
  const sql = "SELECT * FROM product_category";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.post("/categories", (req, res) => {
  const { product_category_name } = req.body;
  const sql =
    "INSERT INTO product_category (`product_category_name`) VALUES (?)";
  const values = [product_category_name];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.put("/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const { product_category_name } = req.body;
  const sql =
    "UPDATE product_category SET `product_category_name` = ? WHERE `product_category_id` = ?";
  const values = [product_category_name, categoryId];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error updating category:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.delete("/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const sql = "DELETE FROM product_category WHERE `product_category_id` = ?";

  dbConnection.query(sql, [categoryId], (err, data) => {
    if (err) {
      console.error("Error deleting category:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

// ORDERS
app.get("/orders", (req, res) => {
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
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.get("/orders/:id", (req, res) => {
  const salesOrderId = req.params.id;
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

  dbConnection.query(query, [salesOrderId], (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.put("/orders/update/:id", async (req, res) => {
  try {
    const soId = req.params.id;

    const adminId = req.session.adminId;
    console.log("Received admin from the frontend:", adminId);

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
    } = req.body;

    const isOrderLockedQuery =
      "SELECT is_order_locked FROM sales_order WHERE so_id = ?";
    const [orderLockResult] = await dbConnection
      .promise()
      .query(isOrderLockedQuery, [soId]);
    const isOrderLocked = orderLockResult[0].is_order_locked;

    const isPaymentLockedQuery =
      "SELECT is_payment_locked FROM sales_order WHERE so_id = ?";
    const [paymentLockResult] = await dbConnection
      .promise()
      .query(isPaymentLockedQuery, [soId]);
    const isPaymentLocked = paymentLockResult[0].is_payment_locked;

    if (isOrderLocked && soOrderStatus !== "Shipped") {
      return res.status(400).json({ error: "Order is locked." });
    }

    if (isPaymentLocked && soPaymentStatus !== "Paid") {
      return res.status(400).json({ error: "Payment is locked." });
    }

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
      soId,
    ];

    if (soOrderStatus === "Shipped" && !isOrderLocked) {
      const deliveryLogQuery =
        "INSERT INTO delivery_logs (so_id_fk, admin_id_fk, log_message) VALUES (?, ?, ?);";
      const [deliveryLogResult] = await dbConnection
        .promise()
        .query(deliveryLogQuery, [soId, adminId, "Order Shipped"]);

      const deliveryLogId = deliveryLogResult.insertId;

      await dbConnection
        .promise()
        .query(
          "UPDATE sales_order SET delivery_log_id_fk = ? WHERE so_id = ?",
          [deliveryLogId, soId]
        );
    }

    if (soPaymentStatus === "Paid" && !isPaymentLocked) {
      const paymentVerificationQuery =
        "INSERT INTO payment_verification (so_id_fk, admin_id_fk, verification_message, is_verified) VALUES (?, ?, ?, 1);";
      const [paymentVerificationResult] = await dbConnection
        .promise()
        .query(paymentVerificationQuery, [soId, adminId, "Order Paid"]);

      const paymentVerificationId = paymentVerificationResult.insertId;

      await dbConnection
        .promise()
        .query(
          "UPDATE sales_order SET payment_verification_id_fk = ? WHERE so_id = ?",
          [paymentVerificationId, soId]
        );
    }

    await dbConnection.promise().query(updateQuery, updateValues);
    res.status(200).json({ message: "Order updated successfully." });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//REQUESTS
app.get("/requests", (req, res) => {
  const sql = "SELECT * FROM refund_return";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.get("/requests/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "SELECT * FROM refund_return WHERE `rr_id` = ?";

  dbConnection.query(sql, [requestId], (err, data) => {
    if (err) {
      console.error("Error fetching request:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(data[0]);
  });
});

app.put("/requests/update/:id", async (req, res) => {
  try {
    try {
      const requestId = req.params.id;
      const adminId = req.session.adminId;
      console.log("Received admin from the frontend:", adminId);

      const {
        requestType,
        requestReason,
        requestImage,
        requestStatus,
        requestLogId,
        salesOrderId,
      } = req.body;

      const isRequestLockedQuery =
        "SELECT is_request_locked FROM refund_return WHERE rr_id = ?";
      const [requestLockResult] = await dbConnection
        .promise()
        .query(isRequestLockedQuery, [requestId]);
      const isRequestLocked = requestLockResult[0].is_request_locked;

      if (isRequestLocked && requestStatus !== "Pending") {
        return res.status(400).json({ error: "Order is locked." });
      }

      const updateQuery = `
      UPDATE refund_return
      SET
        rr_type = ?,
        rr_reason = ?,
        rr_imageProof = ?,
        rr_status = ?,
        is_request_locked = CASE
          WHEN ? = 'Approved' THEN 1
          WHEN ? = 'Declined' THEN 1
          ELSE is_request_locked
        END,
        so_id_fk = ?
      WHERE rr_id = ?
    `;

      const updateValues = [
        requestType,
        requestReason,
        requestImage,
        requestStatus,
        requestStatus,
        requestStatus,
        salesOrderId,
        requestId,
      ];

      if (requestStatus === "Approved" && !isRequestLocked) {
        const requestLogQuery =
          "INSERT INTO request_logs (request_id_fk, admin_id_fk, request_log_message) VALUES (?, ?, ?);";
        const [requestLogResult] = await dbConnection
          .promise()
          .query(requestLogQuery, [requestId, adminId, "Request Approved"]);
        const requestLogId = requestLogResult.insertId;

        await dbConnection
          .promise()
          .query(
            "UPDATE refund_return SET request_log_id_fk = ? WHERE rr_id = ?",
            [requestLogId, requestId]
          );

        if (requestType === "Refund") {
          await dbConnection
            .promise()
            .query(
              "UPDATE sales_order SET so_paymentStatus = 'Refunded' WHERE so_id = ?",
              [salesOrderId]
            );

          await dbConnection
            .promise()
            .query(
              "UPDATE sales_order SET so_orderStatus = 'Delivered' WHERE so_id = ?",
              [salesOrderId]
            );
        } else if (requestType === "Return") {
          try {
            const originalSalesOrderQuery =
              "SELECT * FROM sales_order WHERE so_id = ?";
            const [originalSalesOrderResult] = await dbConnection
              .promise()
              .query(originalSalesOrderQuery, [salesOrderId]);
            const originalSalesOrder = originalSalesOrderResult[0];

            const originalSalesOrderItemsQuery =
              "SELECT * FROM sales_order_item WHERE so_id_fk = ?";
            const [originalSalesOrderItemsResult] = await dbConnection
              .promise()
              .query(originalSalesOrderItemsQuery, [salesOrderId]);
            const originalSalesOrderItems = originalSalesOrderItemsResult;

            const originalShippingQuery =
              "SELECT * FROM shipping WHERE shipping_id = ?";
            const [originalShippingResult] = await dbConnection
              .promise()
              .query(originalShippingQuery, [
                originalSalesOrder.shipping_id_fk,
              ]);
            const originalShipping = originalShippingResult[0];

            const originalShippingAddressQuery =
              "SELECT * FROM shipping_address WHERE shipping_address_id = ?";
            const [originalShippingAddressResult] = await dbConnection
              .promise()
              .query(originalShippingAddressQuery, [
                originalShipping.shipping_address_id_fk,
              ]);
            const originalShippingAddress = originalShippingAddressResult[0];

            const createNewSalesOrderQuery = `
              INSERT INTO sales_order (so_orderDate, so_totalAmount, so_paymentMethod, so_paymentStatus, so_orderStatus, so_orderNotes, shipping_id_fk, customer_account_id_fk)
              VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?)
            `;
            const createNewSalesOrderValues = [
              originalSalesOrder.so_totalAmount,
              originalSalesOrder.so_paymentMethod,
              "Paid",
              "Processing",
              originalSalesOrder.so_orderNotes,
              null,
              originalSalesOrder.customer_account_id_fk,
            ];

            const [newSalesOrderResult] = await dbConnection
              .promise()
              .query(createNewSalesOrderQuery, createNewSalesOrderValues);

            const newSalesOrderId = newSalesOrderResult.insertId;

            await dbConnection
              .promise()
              .query(
                "UPDATE sales_order SET so_orderStatus = 'Returned' WHERE so_id = ?",
                [salesOrderId]
              );

            for (const originalItem of originalSalesOrderItems) {
              const createNewSalesOrderItemQuery = `
                INSERT INTO sales_order_item (so_item_quantity, so_item_unitPrice, so_item_jewelryChain, so_item_jewelryLength, so_item_jewelryTextFront, so_item_jewelryTextBack, so_item_jewelryFont, so_id_fk, product_id_fk)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;
              const createNewSalesOrderItemValues = [
                originalItem.so_item_quantity,
                originalItem.so_item_unitPrice,
                originalItem.so_item_jewelryChain,
                originalItem.so_item_jewelryLength,
                originalItem.so_item_jewelryTextFront,
                originalItem.so_item_jewelryTextBack,
                originalItem.so_item_jewelryFont,
                newSalesOrderId,
                originalItem.product_id_fk,
              ];

              await dbConnection
                .promise()
                .query(
                  createNewSalesOrderItemQuery,
                  createNewSalesOrderItemValues
                );
            }

            const createNewShippingAddressQuery = `
              INSERT INTO shipping_address (shipping_address_firstName, shipping_address_lastName, shipping_address_emailAddress, shipping_address_contactNum, shipping_address_streetOne, shipping_address_streetTwo, shipping_address_city, shipping_address_province, shipping_address_zipCode, customer_account_id_fk)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [newShippingAddressResult] = await dbConnection
              .promise()
              .query(createNewShippingAddressQuery, [
                originalShippingAddress.shipping_address_firstName,
                originalShippingAddress.shipping_address_lastName,
                originalShippingAddress.shipping_address_emailAddress,
                originalShippingAddress.shipping_address_contactNum,
                originalShippingAddress.shipping_address_streetOne,
                originalShippingAddress.shipping_address_streetTwo,
                originalShippingAddress.shipping_address_city,
                originalShippingAddress.shipping_address_province,
                originalShippingAddress.shipping_address_zipCode,
                originalShippingAddress.customer_account_id_fk,
              ]);

            const newShippingAddressId = newShippingAddressResult.insertId;

            const createNewShippingQuery = `
              INSERT INTO shipping (shipping_date, shipping_method, shipping_trackingNumber, so_id_fk, shipping_address_id_fk)
              VALUES (?, ?, ?, ?, ?)
            `;
            const [newShippingResult] = await dbConnection
              .promise()
              .query(createNewShippingQuery, [
                originalShipping.shipping_date,
                originalShipping.shipping_method,
                originalShipping.shipping_trackingNumber,
                newSalesOrderId,
                newShippingAddressId,
              ]);

            const newShippingId = newShippingResult.insertId;

            await dbConnection
              .promise()
              .query(
                "UPDATE sales_order SET shipping_id_fk = ? WHERE so_id = ?",
                [newShippingId, newSalesOrderId]
              );

            await dbConnection
              .promise()
              .query(
                "UPDATE shipping SET shipping_address_id_fk = ? WHERE shipping_id = ?",
                [newShippingAddressId, newShippingId]
              );

            res.status(200).json({
              message: "Request has been updated successfully.",
              newSalesOrderId: newSalesOrderId,
            });
          } catch (error) {
            console.error("Error updating request:", error);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
        }
      }
      if (requestStatus === "Declined" && !isRequestLocked) {
        const requestLogQuery =
          "INSERT INTO request_logs (request_id_fk, admin_id_fk, request_log_message) VALUES (?, ?, ?);";
        const [requestLogResult] = await dbConnection
          .promise()
          .query(requestLogQuery, [requestId, adminId, "Request Declined"]);
        const requestLogId = requestLogResult.insertId;

        await dbConnection
          .promise()
          .query(
            "UPDATE refund_return SET request_log_id_fk = ? WHERE rr_id = ?",
            [requestLogId, requestId]
          );

        await dbConnection
          .promise()
          .query(
            "UPDATE sales_order SET so_orderStatus = 'Delivered' WHERE so_id = ?",
            [salesOrderId]
          );
      }

      await dbConnection.promise().query(updateQuery, updateValues);
      res
        .status(200)
        .json({ message: "Request has been updated successfully." });
    } catch (error) {
      console.error("Error updating request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (outerError) {
    console.error("Outer error:", outerError);
    res.status(500).json({ error: "Outer Error Occurred" });
  }
});

app.get("/requestlogs", (req, res) => {
  const sql = "SELECT * FROM request_logs";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

//PAYMENT VERIFICATION LOG
app.get("/payments", (req, res) => {
  const sql = "SELECT * FROM payment_verification";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.get("/payments/:id", (req, res) => {
  const paymentVerificationLogId = req.params.id;
  const sql = "SELECT * FROM payment_verification WHERE `verification_id` = ?";

  dbConnection.query(sql, [paymentVerificationLogId], (err, data) => {
    if (err) {
      console.error("Error fetching payment verification log:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "Payment Verification Log not found" });
    }
    res.json(data[0]);
  });
});

app.put("/payments/update/:id", async (req, res) => {
  try {
    const paymentVerificationLogId = req.params.id;
    const { paymentVerificationLogReference } = req.body;

    const sql = `
      UPDATE payment_verification
      SET verification_reference = ?
      WHERE verification_id = ?
    `;
    const values = [paymentVerificationLogReference, paymentVerificationLogId];
    dbConnection.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error updating payment verification log:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json("Payment Verification Log has been updated successfully.");
    });
  } catch (error) {
    console.error("Error updating payment verification log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//DELIVERY LOG
app.get("/deliverylogs", (req, res) => {
  const sql = "SELECT * FROM delivery_logs";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.get("/deliverylogs/:id", (req, res) => {
  const deliveryLogId = req.params.id;
  const sql = "SELECT * FROM delivery_logs WHERE `log_id` = ?";

  dbConnection.query(sql, [deliveryLogId], (err, data) => {
    if (err) {
      console.error("Error fetching delivery log:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Delivery Log not found" });
    }
    res.json(data[0]);
  });
});

app.put("/deliverylogs/update/:id", async (req, res) => {
  try {
    const deliveryLogId = req.params.id;
    const { deliveryLogReference } = req.body;

    const sql = `
      UPDATE delivery_logs
      SET log_reference = ?
      WHERE log_id = ?
    `;
    const values = [deliveryLogReference, deliveryLogId];
    dbConnection.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error updating delivery log:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json("Delivery Log has been updated successfully.");
    });
  } catch (error) {
    console.error("Error updating delivery log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//SHIPMENT
app.get("/shipments", (req, res) => {
  const sql = "SELECT * FROM shipping";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.get("/shipments/:id", (req, res) => {
  const shipmentId = req.params.id;
  const sql = "SELECT * FROM shipping WHERE `shipping_id` = ?";

  dbConnection.query(sql, [shipmentId], (err, data) => {
    if (err) {
      console.error("Error fetching shipment:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Shipment may not be found" });
    }
    res.json(data[0]);
  });
});

//SHIPPING ADDRESS
app.get("/shippingaddress", (req, res) => {
  const sql = "SELECT * FROM shipping_address";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.get("/shippingaddress/:id", (req, res) => {
  const shippingAddressId = req.params.id;
  const sql = "SELECT * FROM shipping_address WHERE `shipping_address_id` = ?";

  dbConnection.query(sql, [shippingAddressId], (err, data) => {
    if (err) {
      console.error("Error fetching shipping address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "Shipping Address may not be found" });
    }
    res.json(data[0]);
  });
});

//LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM admin WHERE admin_username = ?`;

  dbConnection.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      res.status(500).json({ success: false });
      return;
    }

    if (results.length > 0) {
      const hashedPassword = results[0].admin_password;

      bcrypt.compare(password, hashedPassword, (compareErr, match) => {
        if (compareErr) {
          console.error("Error comparing passwords:", compareErr);
          res.status(500).json({ success: false });
          return;
        }

        if (match) {
          req.session.adminId = results[0].admin_id;
          req.session.adminName = results[0].admin_name;

          res.json({
            Login: true,
            adminId: results[0].admin_id,
            adminName: results[0].admin_name,
          });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      });
    } else {
      res.status(404).json({ error: "No matching records found" });
    }
  });
});

app.get("/login", (req, res) => {
  if (req.session.adminId) {
    res.send({
      loggedIn: true,
      adminId: req.session.adminId,
      adminName: req.session.adminName,
    });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ error: "Error logging out" });
    }
    return res.json({ loggedOut: true });
  });
});

//DASHBOARD
app.get("/dashboard/orders/day/count", (req, res) => {
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
});

app.get("/dashboard/orders/week/count", (req, res) => {
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
});

app.get("/dashboard/orders/month/count", (req, res) => {
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
});

app.get("/dashboard/orders/count", (req, res) => {
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
});

app.get("/dashboard/customers/count", (req, res) => {
  const customersCountQuery = `
    SELECT COUNT(*) as count FROM customer_account
  `;

  dbConnection.query(customersCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
});

app.get("/dashboard/products/count", (req, res) => {
  const productCountQuery = `
    SELECT COUNT(*) as count FROM product
  `;

  dbConnection.query(productCountQuery, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json({ count: 0 });
    }
    return res.json({ count: data[0].count });
  });
});

app.get("/dashboard/orders/pending", (req, res) => {
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
});

app.get("/dashboard/orders/completed", (req, res) => {
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
});

app.get("/dashboard/orders/requested", (req, res) => {
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
});

app.get("/dashboard/orders/recentactivity", (req, res) => {
  const query = `
  SELECT
  so.*,
  sh.*,
  sa.*
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
});

//ADMIN
app.get("/admins", async (req, res) => {
  const sql = "SELECT * FROM admin";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/admins", async (req, res) => {
  try {
    const { admin_name, admin_emailAddress, admin_username, admin_password } =
      req.body;
    const hashedPassword = await bcrypt.hash(admin_password, 10);
    const sql =
      "INSERT INTO admin (`admin_name`, `admin_emailAddress`, `admin_username`, `admin_password`) VALUES (?, ?, ?, ?)";
    const values = [
      admin_name,
      admin_emailAddress,
      admin_username,
      hashedPassword,
    ];

    dbConnection.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error inserting into the database:", err);
        return res.json("Error");
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/admins/:id", async (req, res) => {
  const adminId = req.params.id;
  const sql = "DELETE FROM admin WHERE `admin_id` = ?";
  dbConnection.query(sql, [adminId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Admin has been deleted successfully.");
  });
});

app.get("/admins/:id", async (req, res) => {
  const adminId = req.params.id;
  const sql = "SELECT * FROM admin WHERE `admin_id` = ?";

  dbConnection.query(sql, [adminId], (err, data) => {
    if (err) {
      console.error("Error fetching admin:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(data[0]);
  });
});

app.put("/admins/update/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const { adminName, adminEmailAddress, adminUsername, adminPassword } =
      req.body;
    let hashedPassword = adminPassword;
    if (adminPassword) {
      hashedPassword = await bcrypt.hash(adminPassword, 10);
    }
    const sql = `
    UPDATE admin
    SET
    admin_name = ?,
    admin_emailAddress = ?,
    admin_username = ?,
    admin_password = ?
    WHERE admin_id = ?
  `;
    const values = [
      adminName,
      adminEmailAddress,
      adminUsername,
      hashedPassword,
      adminId,
    ];
    dbConnection.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error updating admin:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json("Admin has been updated successfully.");
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(8081, () => {
  console.log("Listening");
});
