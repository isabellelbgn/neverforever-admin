import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentVerificationLogUpdate() {
  const [paymentVerificationLog, setPaymentVerificationLog] = useState({
    paymentVerificationLogId: "",
    paymentVerificationLogSalesOrderId: "",
    paymentVerificationLogMessage: "",
    paymentVerificationLogReference: "",
    paymentVerificationLogAdmin: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const paymentVerificationLogId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchPaymentVerificationLogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/payments/${paymentVerificationLogId}`
        );
        console.log("Response data:", response.data);
        console.log("Payment verification log ID:", paymentVerificationLogId);

        const paymentVerificationLogData = response.data;

        if (!paymentVerificationLogData) {
          console.error("Payment verification log data not found");
          return;
        }

        setPaymentVerificationLog((prevPaymentVerificationLog) => ({
          ...prevPaymentVerificationLog,
          paymentVerificationLogId: paymentVerificationLogData.verification_id,
          paymentVerificationLogSalesOrderId:
            paymentVerificationLogData.so_id_fk,
          paymentVerificationLogMessage:
            paymentVerificationLogData.verification_message,
          paymentVerificationLogReference:
            paymentVerificationLogData.verification_reference,
          paymentVerificationLogAdmin: paymentVerificationLogData.admin_id_fk,
        }));
      } catch (error) {
        console.error("Error fetching delivery log data:", error);
      }
    };

    fetchPaymentVerificationLogs();
  }, [paymentVerificationLogId]);

  const handleChange = (e) => {
    setPaymentVerificationLog((prevPaymentVerificationLog) => ({
      ...prevPaymentVerificationLog,
      paymentVerificationLogReference: e.target.value,
    }));
  };

  const handleClick = async () => {
    try {
      await axios.put(
        `http://localhost:8081/payments/update/${paymentVerificationLogId}`,
        {
          paymentVerificationLogReference:
            paymentVerificationLog.paymentVerificationLogReference,
        }
      );
      navigate("/payments");
    } catch (err) {
      console.error("Error updating payment verification log:", err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold">
          Update Payment Verification Log
        </h1>

        <div className="mb-2">
          <label htmlFor="paymentVerificationLogId">
            Payment Verification Log ID
          </label>
          <input
            type="number"
            id="paymentVerificationLogId"
            name="paymentVerificationLogId"
            value={paymentVerificationLog.paymentVerificationLogId}
            disabled
          />
        </div>

        <label>Sales Order ID</label>
        <input
          type="number"
          name="paymentVerificationLogSalesOrderId"
          value={paymentVerificationLog.paymentVerificationLogSalesOrderId}
          disabled
        />

        <label> Message </label>
        <input
          type="text"
          name="paymentVerificationLogMessage"
          value={paymentVerificationLog.paymentVerificationLogMessage}
          disabled
        />

        <label> Reference </label>
        <input
          type="text"
          placeholder="Enter Shipping Reference Number"
          name="paymentVerificationLogReference"
          value={paymentVerificationLog.paymentVerificationLogReference}
          onChange={handleChange}
        />

        <label>Admin ID</label>
        <input
          type="number"
          name="paymentVerificationLogAdmin"
          value={paymentVerificationLog.paymentVerificationLogAdmin}
          disabled
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="button"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            SAVE PAYMENT VERIFICATION LOG
          </button>
        </div>
      </form>
    </div>
  );
}

export default PaymentVerificationLogUpdate;
