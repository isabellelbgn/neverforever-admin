const dbConnection = require("../config/db");

module.exports = {
  getAllDeliveryLogs: (callback) => {
    const sql = "SELECT * FROM delivery_logs";
    dbConnection.query(sql, callback);
  },

  getDeliveryLogById: (deliveryLogId, callback) => {
    const sql = "SELECT * FROM delivery_logs WHERE `log_id` = ?";
    dbConnection.query(sql, [deliveryLogId], callback);
  },

  updateDeliveryLog: (deliveryLogId, deliveryLogReference, callback) => {
    const sql = `
      UPDATE delivery_logs
      SET log_reference = ?
      WHERE log_id = ?
    `;
    const values = [deliveryLogReference, deliveryLogId];
    dbConnection.query(sql, values, callback);
  },
};
