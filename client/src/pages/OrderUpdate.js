import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function OrderUpdate() {
  const [salesOrder, setSalesOrder] = useState({
    soOrderDate: "",
    soTotalAmount: "",
    soPaymentMethod: "",
    soPaymentStatus: "",
    soOrderStatus: "",
    soOrderNotes: "",
    soShippingId: "",
    soCustomerAccountId: "",
    soPaymentVerificationId: "",
    soDeliveryLogId: "",
  });

  const [isOrderLocked, setIsOrderLocked] = useState(false);
  const [isPaymentLocked, setIsPaymentLocked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const soId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchSalesOrderData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/orders/${soId}`
        );
        const soData = response.data[0];
        console.log("API Response Data:", soData);

        setSalesOrder({
          soOrderDate: soData.soOrderDate,
          soTotalAmount: soData.so_totalAmount,
          soPaymentMethod: soData.so_paymentMethod,
          soPaymentStatus: soData.so_paymentStatus,
          soOrderStatus: soData.so_orderStatus,
          soOrderNotes: soData.so_orderNotes,
          soShippingId: soData.shipping_id,
          soCustomerAccountId: soData.customer_account_id,
          soPaymentVerificationId: soData.verification_id,
          soDeliveryLogId: soData.log_id,
        });

        setIsOrderLocked(soData.is_order_locked);
        setIsPaymentLocked(soData.is_payment_locked);
      } catch (error) {
        console.error("Error fetching sales order data:", error);
      }
    };
    fetchSalesOrderData();
  }, [soId]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/orders/update/${soId}`, {
        ...salesOrder,
      });
      navigate("/orders");
    } catch (err) {
      console.error("Error updating sales order:", err);
    }
  };

  const handlePaymentStatusChange = (newStatus) => {
    setSalesOrder({
      ...salesOrder,
      soPaymentStatus: newStatus,
    });
  };

  const handleOrderStatusChange = (newStatus) => {
    setSalesOrder({
      ...salesOrder,
      soOrderStatus: newStatus,
    });
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = `${currentDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${currentDate.getDate()}`.padStart(2, "0");
    const hours = `${currentDate.getHours()}`.padStart(2, "0");
    const minutes = `${currentDate.getMinutes()}`.padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    setSalesOrder((prevSalesOrder) => ({
      ...prevSalesOrder,
      soOrderDate: formattedDate,
    }));
  }, []);

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Update Order </h1>

        <div className="mb-2">
          <label> Order Date</label>
          <input
            type="datetime-local"
            name="soOrderDate"
            value={salesOrder.soOrderDate}
            disabled
          />
        </div>

        <label> Total Amount </label>
        <input
          type="number"
          placeholder="Enter Total Amount"
          name="soTotalAmount"
          value={salesOrder.soTotalAmount}
          disabled
        />

        <label>Payment Method</label>
        <select
          name="soPaymentMethod"
          value={salesOrder.soPaymentMethod}
          disabled
        >
          <option value=""></option>
          <option value="Gcash">Gcash</option>
          <option value="BPI">BPI</option>
          <option value="COD">COD</option>
        </select>

        <label>Payment Status</label>
        <select
          name="soPaymentStatus"
          value={salesOrder.soPaymentStatus}
          onChange={(e) => handlePaymentStatusChange(e.target.value)}
          disabled={isPaymentLocked}
        >
          <option value=""></option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>

        <label>Order Status</label>
        <select
          name="soOrderStatus"
          value={salesOrder.soOrderStatus}
          onChange={(e) => handleOrderStatusChange(e.target.value)}
          disabled={isOrderLocked}
        >
          <option value=""></option>
          <option value="In Progress">In Progress</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Refund Requested">Refund Requested</option>
          <option value="Return Requested">Return Requested</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>

        <label> Order Notes </label>
        <textarea
          placeholder="Enter Order Notes"
          name="soOrderNotes"
          value={salesOrder.soOrderNotes}
          disabled
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            {" "}
            SAVE ORDER{" "}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrderUpdate;
