import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function RequestUpdate() {
  const [request, setRequest] = useState({
    requestType: "",
    requestReason: "",
    requestImage: "",
    requestStatus: "",
    requestDate: "",
    requestLogsId: "",
    salesOrderId: "",
  });

  const [isRequestLocked, setIsRequestLocked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const requestId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/requests/${requestId}`
        );
        const requestData = response.data;

        setRequest({
          requestType: requestData.rr_type,
          requestReason: requestData.rr_reason,
          requestImage: requestData.rr_imageProof,
          requestStatus: requestData.rr_status,
          requestDate: requestData.rr_createdAt,
          requestLogsId: requestData.request_logs_id_fk,
          salesOrderId: requestData.so_id_fk,
        });

        setIsRequestLocked(requestData.is_request_locked);
      } catch (error) {
        console.error("Error fetching request data:", error);
      }
    };
    fetchRequestData();
  }, [requestId]);

  const handleRequestStatusChange = (newStatus) => {
    setRequest({
      ...request,
      requestStatus: newStatus,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/requests/update/${requestId}`,
        request
      );
      navigate("/requests");
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Update Request </h1>

        <div className="mb-2">
          <label> Request Type </label>
          <input type="text" value={request.requestType} disabled />
        </div>

        <label> Request Reason </label>
        <textarea value={request.requestReason} disabled />

        <label> Proof of Image </label>
        <div className="mb-2">
          <img
            src={request.requestImage}
            alt="Request Proof"
            width="300"
            height="300"
            className="w-500 h-500"
          />
        </div>

        <label>Request Status</label>
        <select
          value={request.requestStatus}
          onChange={(e) => handleRequestStatusChange(e.target.value)}
          disabled={isRequestLocked}
        >
          <option value=""></option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
        </select>

        <label> Request Date </label>
        <input type="text" value={request.requestDate} disabled />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            {" "}
            SAVE REQUEST{" "}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestUpdate;
