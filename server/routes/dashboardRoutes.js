const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get(
  "/dashboard/orders/day/count",
  dashboardController.getDayOrdersCount
);
router.get(
  "/dashboard/orders/week/count",
  dashboardController.getWeekOrdersCount
);
router.get(
  "/dashboard/orders/month/count",
  dashboardController.getMonthOrdersCount
);
router.get("/dashboard/orders/count", dashboardController.getTotalOrdersCount);
router.get("/dashboard/customers/count", dashboardController.getCustomersCount);
router.get("/dashboard/products/count", dashboardController.getProductsCount);
router.get(
  "/dashboard/orders/pending",
  dashboardController.getPendingOrdersCount
);
router.get(
  "/dashboard/orders/completed",
  dashboardController.getCompletedOrdersCount
);
router.get(
  "/dashboard/orders/requested",
  dashboardController.getRequestedOrdersCount
);
router.get(
  "/dashboard/orders/recentactivity",
  dashboardController.getRecentActivity
);

module.exports = router;
