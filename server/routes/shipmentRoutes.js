const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipmentController");

router.get("/shipments", shipmentController.getAllShipments);
router.get("/shipments/:id", shipmentController.getShipmentById);

module.exports = router;
