import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function PurchaseOrderUpdate() {
  const [purchaseOrder, setPurchaseOrder] = useState({
    purchaseOrderDate: "",
    purchaseOrderDeliveryDate: "",
    purchaseOrderTotalAmount: "",
    supplierId: "",
  });

  const [suppliers, setSuppliers] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const purchaseOrderId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:8081/suppliers");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchPurchaseOrderData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/purchaseorders/${purchaseOrderId}`
        );
        const purchaseOrderData = response.data;

        setPurchaseOrder({
          purchaseOrderDate: purchaseOrderData.po_orderDate,
          purchaseOrderDeliveryDate: purchaseOrderData.po_deliveryDate,
          purchaseOrderTotalAmount: purchaseOrderData.po_totalAmount,
          supplierId: purchaseOrderData.supplier_id_fk,
        });
      } catch (error) {
        console.error("Error fetching purchase order data:", error);
      }
    };
    fetchPurchaseOrderData();
  }, [purchaseOrderId]);

  const handleChange = (e) => {
    setPurchaseOrder({
      ...purchaseOrder,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/purchaseorders/update/${purchaseOrderId}`,
        purchaseOrder
      );
      navigate("/purchaseorders");
    } catch (err) {
      console.error("Error updating purchase order:", err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold">
          {" "}
          Update Purchase Order{" "}
        </h1>

        <div className="mb-2">
          <label> Order Date </label>
          <input
            type="text"
            name="purchaseOrderDate"
            value={purchaseOrder.purchaseOrderDate}
            readOnly
          />
        </div>

        <label> Delivery Date </label>
        <input
          type="date"
          name="purchaseOrderDeliveryDate"
          value={purchaseOrder.purchaseOrderDeliveryDate}
          onChange={handleChange}
        />

        <label> Total Amount </label>
        <input
          type="number"
          placeholder="Total Amount"
          name="purchaseOrderTotalAmount"
          value={purchaseOrder.purchaseOrderTotalAmount}
          disabled
        />

        <label>Supplier</label>
        <select
          name="supplierId"
          onChange={handleChange}
          value={purchaseOrder.supplierId}
          disabled
        >
          <option value=""></option>
          {suppliers.map((supplier) => (
            <option key={supplier.supplier_id} value={supplier.supplier_id}>
              {supplier.supplier_name}
            </option>
          ))}
        </select>

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            {" "}
            SAVE PURCHASE ORDER{" "}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PurchaseOrderUpdate;
