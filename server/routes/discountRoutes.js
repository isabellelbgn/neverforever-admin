const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");

router.get("/discounts", discountController.getDiscounts);
router.get("/discounts/:id", discountController.getDiscountById);
router.post("/discounts", discountController.createDiscount);
router.put("/discounts/update/:id", discountController.updateDiscount);
router.delete("/discounts/:id", discountController.deleteDiscount);

module.exports = router;
