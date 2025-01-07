const DeliveryLog = require("../models/deliveryLogModel");

exports.getAllDeliveryLogs = (req, res) => {
  DeliveryLog.getAllDeliveryLogs((err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    res.json(data);
  });
};

exports.getDeliveryLogById = (req, res) => {
  const deliveryLogId = req.params.id;
  DeliveryLog.getDeliveryLogById(deliveryLogId, (err, data) => {
    if (err) {
      console.error("Error fetching delivery log:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Delivery Log not found" });
    }
    res.json(data[0]);
  });
};

exports.updateDeliveryLog = (req, res) => {
  const deliveryLogId = req.params.id;
  const { deliveryLogReference } = req.body;

  DeliveryLog.updateDeliveryLog(
    deliveryLogId,
    deliveryLogReference,
    (err, data) => {
      if (err) {
        console.error("Error updating delivery log:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json("Delivery Log has been updated successfully.");
    }
  );
};
