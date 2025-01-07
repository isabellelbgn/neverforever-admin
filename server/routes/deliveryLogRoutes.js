const express = require("express");
const router = express.Router();
const deliveryLogController = require("../controllers/deliveryLogController");

router.get("/deliverylogs", deliveryLogController.getAllDeliveryLogs);
router.get("/deliverylogs/:id", deliveryLogController.getDeliveryLogById);
router.put("/deliverylogs/update/:id", deliveryLogController.updateDeliveryLog);

module.exports = router;
