const express = require("express");
const cors = require("cors");
require("dotenv").config();
const customerRoutes = require("./routes/customerRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const discountRoutes = require("./routes/discountRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const requestRoutes = require("./routes/requestRoutes");
const paymentVerificationRoutes = require("./routes/paymentVerificationRoutes");
const deliveryLogRoutes = require("./routes/deliveryLogRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

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
app.use(express.static("public"));

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

app.use(customerRoutes);
app.use(rewardRoutes);
app.use(supplierRoutes);
app.use(purchaseOrderRoutes);
app.use(productRoutes);
app.use(reviewRoutes);
app.use(discountRoutes);
app.use(categoryRoutes);
app.use(orderRoutes);
app.use(requestRoutes);
app.use(paymentVerificationRoutes);
app.use(deliveryLogRoutes);
app.use(shipmentRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(dashboardRoutes);

app.listen(8081, () => {
  console.log(`Server running on http://localhost:8081`);
});
