const ShippingAddress = require("../models/shippingAddressModel");

exports.getAllShippingAddresses = (req, res) => {
  ShippingAddress.getAllShippingAddresses((err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(data);
  });
};

exports.getShippingAddressById = (req, res) => {
  const shippingAddressId = req.params.id;
  ShippingAddress.getShippingAddressById(shippingAddressId, (err, data) => {
    if (err) {
      console.error("Error fetching shipping address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "Shipping Address may not be found" });
    }
    res.json(data[0]);
  });
};
