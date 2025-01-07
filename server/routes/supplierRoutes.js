const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

router.get("/suppliers", supplierController.getSuppliers);
router.post("/suppliers", supplierController.addSupplier);
router.delete("/suppliers/:id", supplierController.deleteSupplier);
router.get("/suppliers/:id", supplierController.getSupplierById);
router.put("/suppliers/update/:id", supplierController.updateSupplier);

module.exports = router;
