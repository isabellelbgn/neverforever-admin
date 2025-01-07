const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/orders", orderController.getOrders);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/update/:id", orderController.updateOrder);

module.exports = router;
