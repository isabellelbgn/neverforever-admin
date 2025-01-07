const express = require("express");
const router = express.Router();
const purchaseOrderController = require("../controllers/purchaseOrderController");

router.get("/purchaseorders", purchaseOrderController.getPurchaseOrders);
router.post("/purchaseorders", purchaseOrderController.addPurchaseOrder);
router.get(
  "/purchaseorders/usedsalesorders",
  purchaseOrderController.getUsedSalesOrders
);
router.delete(
  "/purchaseorders/:id",
  purchaseOrderController.deletePurchaseOrder
);
router.get("/purchaseorders/:id", purchaseOrderController.getPurchaseOrderById);
router.put(
  "/purchaseorders/update/:id",
  purchaseOrderController.updatePurchaseOrder
);

module.exports = router;
