const Supplier = require("../models/supplierModel");

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const [data] = await Supplier.getAllSuppliers();
    res.json(data);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new supplier
exports.addSupplier = async (req, res) => {
  try {
    const {
      supplier_name,
      supplier_contactPerson,
      supplier_contactNumber,
      supplier_emailAddress,
      supplier_shippingAddress,
    } = req.body;

    const values = [
      supplier_name,
      supplier_contactPerson,
      supplier_contactNumber,
      supplier_emailAddress,
      supplier_shippingAddress,
    ];

    const [data] = await Supplier.addSupplier(values);
    res.json(data);
  } catch (err) {
    console.error("Error inserting into the database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    await Supplier.deleteSupplier(supplierId);
    res.json("Supplier has been deleted successfully.");
  } catch (err) {
    console.error("Error deleting supplier:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a supplier by ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const [data] = await Supplier.getSupplierById(supplierId);

    if (data.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error("Error fetching supplier:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a supplier
exports.updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const {
      supplierName,
      supplierContactPerson,
      supplierContactNumber,
      supplierEmailAddress,
      supplierShippingAddress,
    } = req.body;

    const values = [
      supplierName,
      supplierContactPerson,
      supplierContactNumber,
      supplierEmailAddress,
      supplierShippingAddress,
    ];

    await Supplier.updateSupplier(values, supplierId);
    res.json("Supplier has been updated successfully.");
  } catch (err) {
    console.error("Error updating supplier:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
