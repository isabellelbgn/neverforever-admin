import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function DeliveryLogUpdate() {
  const [deliveryLog, setDeliveryLog] = useState({
    deliveryLogId: "",
    deliveryLogSalesOrderId: "",
    deliveryLogMessage: "",
    deliveryLogReference: "",
    deliveryLogAdmin: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const deliveryLogId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchDeliveryLogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/deliverylogs/${deliveryLogId}`
        );
        console.log("Response data:", response.data);
        console.log("Delivery log ID:", deliveryLogId);

        const deliveryLogData = response.data;

        if (!deliveryLogData) {
          console.error("Delivery log data not found");
          return;
        }

        setDeliveryLog((prevDeliveryLog) => ({
          ...prevDeliveryLog,
          deliveryLogId: deliveryLogData.log_id,
          deliveryLogSalesOrderId: deliveryLogData.so_id_fk,
          deliveryLogMessage: deliveryLogData.log_message,
          deliveryLogReference: deliveryLogData.log_reference,
          deliveryLogAdmin: deliveryLogData.admin_id_fk,
        }));
      } catch (error) {
        console.error("Error fetching delivery log data:", error);
      }
    };

    fetchDeliveryLogs();
  }, [deliveryLogId]);

  const handleChange = (e) => {
    setDeliveryLog((prevDeliveryLog) => ({
      ...prevDeliveryLog,
      deliveryLogReference: e.target.value,
    }));
  };

  const handleClick = async () => {
    try {
      await axios.put(
        `http://localhost:8081/deliverylogs/update/${deliveryLogId}`,
        {
          deliveryLogReference: deliveryLog.deliveryLogReference,
        }
      );
      navigate("/deliverylogs");
    } catch (err) {
      console.error("Error updating delivery log:", err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold">Update Delivery Log</h1>

        <div className="mb-2">
          <label htmlFor="deliveryLogId">Delivery Log ID</label>
          <input
            type="number"
            id="deliveryLogId"
            name="deliveryLogId"
            value={deliveryLog.deliveryLogId}
            disabled
          />
        </div>

        <label>Sales Order ID</label>
        <input
          type="number"
          name="deliveryLogSalesOrderId"
          value={deliveryLog.deliveryLogSalesOrderId}
          disabled
        />

        <label> Message </label>
        <input
          type="text"
          name="deliveryLogMessage"
          value={deliveryLog.deliveryLogMessage}
          disabled
        />

        <label> Reference </label>
        <input
          type="text"
          placeholder="Enter Shipping Reference Number"
          name="deliveryLogReference"
          value={deliveryLog.deliveryLogReference}
          onChange={handleChange}
        />

        <label>Admin ID</label>
        <input
          type="number"
          name="deliveryLogAdmin"
          value={deliveryLog.deliveryLogAdmin}
          disabled
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="button"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            SAVE DELIVERY LOG
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeliveryLogUpdate;
