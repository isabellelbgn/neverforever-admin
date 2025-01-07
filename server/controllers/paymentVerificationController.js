const PaymentVerification = require("../models/paymentVerificationModel");

exports.getAllPayments = (req, res) => {
  PaymentVerification.getAllPayments((err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    res.json(data);
  });
};

exports.getPaymentById = (req, res) => {
  const paymentVerificationLogId = req.params.id;
  PaymentVerification.getPaymentById(paymentVerificationLogId, (err, data) => {
    if (err) {
      console.error("Error fetching payment verification log:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "Payment Verification Log not found" });
    }
    res.json(data[0]);
  });
};

exports.updatePayment = (req, res) => {
  const paymentVerificationLogId = req.params.id;
  const { paymentVerificationLogReference } = req.body;

  PaymentVerification.updatePayment(
    paymentVerificationLogId,
    paymentVerificationLogReference,
    (err, data) => {
      if (err) {
        console.error("Error updating payment verification log:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json("Payment Verification Log has been updated successfully.");
    }
  );
};
