const requestModel = require("../models/requestModel");

exports.getAllRequests = async (req, res) => {
  try {
    const data = await requestModel.getAllRequests();
    res.json(data);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.json("Error");
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const data = await requestModel.getRequestById(requestId);
    if (!data) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const adminId = req.session.adminId;
    const requestData = req.body;
    const result = await requestModel.updateRequest(
      requestId,
      adminId,
      requestData
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllRequestLogs = async (req, res) => {
  try {
    const data = await requestModel.getAllRequestLogs();
    res.json(data);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.json("Error");
  }
};
