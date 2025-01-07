const Request = require("../models/requestModel");

// Get all requests
const getRequests = async (req, res) => {
  try {
    const [data] = await Request.getAllRequests();
    res.json(data);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).json("Error");
  }
};

// Get requests by id
const getRequestById = async (req, res) => {
  const requestId = req.params.id;
  try {
    const [data] = await Request.getRequestById(requestId);
    if (data.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error("Error fetching request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update request
const updateRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const adminId = req.session.adminId;
    console.log("Received admin from the frontend:", adminId);

    const {
      requestType,
      requestReason,
      requestImage,
      requestStatus,
      salesOrderId,
    } = req.body;

    const isRequestLockedQuery =
      "SELECT is_request_locked FROM refund_return WHERE rr_id = ?";
    const [requestLockResult] = await dbConnection
      .promise()
      .query(isRequestLockedQuery, [requestId]);
    const isRequestLocked = requestLockResult[0].is_request_locked;

    if (isRequestLocked && requestStatus !== "Pending") {
      return res.status(400).json({ error: "Request is locked." });
    }

    const data = {
      requestType,
      requestReason,
      requestImage,
      requestStatus,
      salesOrderId,
      requestId,
    };

    await Request.updateRequest(data);

    // Handle different cases such as "Approved" or "Declined"
    if (requestStatus === "Approved") {
      // Add logic for approved request
    }

    if (requestStatus === "Declined") {
      // Add logic for declined request
    }

    res.status(200).json({ message: "Request updated successfully." });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get request logs
const getRequestLogs = async (req, res) => {
  try {
    const sql = "SELECT * FROM request_logs";
    const [data] = await dbConnection.promise().query(sql);
    res.json(data);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.json("Error");
  }
};

module.exports = {
  getRequests,
  getRequestById,
  updateRequest,
  getRequestLogs,
};
