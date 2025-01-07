const dbConnection = require("../config/db");

// Get all requests
const getAllRequests = () => {
  return dbConnection.promise().query("SELECT * FROM refund_return");
};

// Get request by id
const getRequestById = (requestId) => {
  return dbConnection
    .promise()
    .query("SELECT * FROM refund_return WHERE rr_id = ?", [requestId]);
};

// Update request
const updateRequest = (data) => {
  const {
    requestType,
    requestReason,
    requestImage,
    requestStatus,
    salesOrderId,
    requestId,
  } = data;

  const updateQuery = `
    UPDATE refund_return
    SET
      rr_type = ?,
      rr_reason = ?,
      rr_imageProof = ?,
      rr_status = ?,
      is_request_locked = CASE
        WHEN ? = 'Approved' THEN 1
        WHEN ? = 'Declined' THEN 1
        ELSE is_request_locked
      END,
      so_id_fk = ?
    WHERE rr_id = ?
  `;

  const updateValues = [
    requestType,
    requestReason,
    requestImage,
    requestStatus,
    requestStatus,
    requestStatus,
    salesOrderId,
    requestId,
  ];

  return dbConnection.promise().query(updateQuery, updateValues);
};

module.exports = {
  getAllRequests,
  getRequestById,
  updateRequest,
};
