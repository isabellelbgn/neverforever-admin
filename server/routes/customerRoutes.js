const express = require("express");
const customerController = require("../controllers/customerController");
const router = express.Router();

router.get("/customers", customerController.getAllCustomers);
router.get("/customers/:id", customerController.getCustomerById);
router.post("/customers", customerController.addCustomer);
router.put("/customers/update/:id", customerController.updateCustomer);
router.delete("/customers/:id", customerController.deleteCustomer);
router.post("/checkCustomerDuplicate", customerController.checkDuplicate);
router.post("/checkCustomerUpdateDuplicate", customerController.checkDuplicate);

module.exports = router;
