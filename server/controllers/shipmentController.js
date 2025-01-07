const Shipment = require("../models/shipmentModel");

exports.getAllShipments = (req, res) => {
  Shipment.getAllShipments((err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(data);
  });
};

exports.getShipmentById = (req, res) => {
  const shipmentId = req.params.id;
  Shipment.getShipmentById(shipmentId, (err, data) => {
    if (err) {
      console.error("Error fetching shipment:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Shipment may not be found" });
    }
    res.json(data[0]);
  });
};
