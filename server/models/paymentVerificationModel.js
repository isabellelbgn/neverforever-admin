const dbConnection = require("../config/db");

module.exports = {
  getAllPayments: (callback) => {
    const sql = "SELECT * FROM payment_verification";
    dbConnection.query(sql, callback);
  },

  getPaymentById: (paymentVerificationLogId, callback) => {
    const sql =
      "SELECT * FROM payment_verification WHERE `verification_id` = ?";
    dbConnection.query(sql, [paymentVerificationLogId], callback);
  },

  updatePayment: (
    paymentVerificationLogId,
    paymentVerificationLogReference,
    callback
  ) => {
    const sql = `
      UPDATE payment_verification
      SET verification_reference = ?
      WHERE verification_id = ?
    `;
    const values = [paymentVerificationLogReference, paymentVerificationLogId];
    dbConnection.query(sql, values, callback);
  },
};
