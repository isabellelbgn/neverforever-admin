const PurchaseOrder = require("../models/purchaseOrderModel");

// Get all purchase orders
exports.getPurchaseOrders = async (req, res) => {
  try {
    const [data] = await PurchaseOrder.getAllPurchaseOrders();
    res.json(data);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new purchase order
exports.addPurchaseOrder = async (req, res) => {
  try {
    const {
      po_orderDate,
      po_deliveryDate,
      po_totalAmount,
      supplier_id_fk,
      salesOrderIds,
    } = req.body;

    const purchaseOrderValues = [
      po_orderDate,
      po_deliveryDate || null,
      po_totalAmount,
      supplier_id_fk,
    ];

    const [purchaseOrderResult] = await PurchaseOrder.addPurchaseOrder(
      purchaseOrderValues
    );
    const po_id = purchaseOrderResult.insertId;

    if (salesOrderIds && salesOrderIds.length > 0) {
      const relationsValues = salesOrderIds.map((so_id) => [po_id, so_id]);
      await PurchaseOrder.addPurchaseOrderRelations(relationsValues);
    }

    res.json({ message: "Purchase Order added successfully." });
  } catch (err) {
    console.error("Error adding purchase order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get used sales orders
exports.getUsedSalesOrders = async (req, res) => {
  try {
    const [rows] = await PurchaseOrder.getUsedSalesOrders();
    const usedSalesOrders = rows.map((row) => row.so_id_fk);
    res.json(usedSalesOrders);
  } catch (err) {
    console.error("Error fetching used sales orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a purchase order
exports.deletePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrderId = req.params.id;

    await PurchaseOrder.deletePurchaseOrderRelations(purchaseOrderId);
    await PurchaseOrder.deletePurchaseOrder(purchaseOrderId);

    res.json("Purchase Order and related records deleted successfully.");
  } catch (err) {
    console.error("Error deleting purchase order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific purchase order by ID
exports.getPurchaseOrderById = async (req, res) => {
  try {
    const purchaseOrderId = req.params.id;
    const [data] = await PurchaseOrder.getPurchaseOrderById(purchaseOrderId);

    if (data.length === 0) {
      return res.status(404).json({ error: "Purchase Order not found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error("Error fetching purchase order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a purchase order
exports.updatePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrderId = req.params.id;
    const { purchaseOrderDeliveryDate, purchaseOrderTotalAmount, supplierId } =
      req.body;

    const values = [
      purchaseOrderDeliveryDate || null,
      purchaseOrderTotalAmount,
      supplierId,
    ];

    await PurchaseOrder.updatePurchaseOrder(values, purchaseOrderId);
    res.json("Purchase Order has been updated successfully.");
  } catch (err) {
    console.error("Error updating purchase order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
