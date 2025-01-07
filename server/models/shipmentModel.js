const dbConnection = require("../config/db");

module.exports = {
  getAllShipments: (callback) => {
    const sql = "SELECT * FROM shipping";
    dbConnection.query(sql, callback);
  },

  getShipmentById: (shipmentId, callback) => {
    const sql = "SELECT * FROM shipping WHERE `shipping_id` = ?";
    dbConnection.query(sql, [shipmentId], callback);
  },
};
