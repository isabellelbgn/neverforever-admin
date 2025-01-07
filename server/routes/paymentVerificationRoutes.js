const express = require("express");
const router = express.Router();
const paymentVerificationController = require("../controllers/paymentVerificationController");

router.get("/payments", paymentVerificationController.getAllPayments);
router.get("/payments/:id", paymentVerificationController.getPaymentById);
router.put("/payments/update/:id", paymentVerificationController.updatePayment);

module.exports = router;
