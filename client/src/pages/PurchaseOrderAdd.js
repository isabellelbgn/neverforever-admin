import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PurchaseOrderAdd() {
  const [purchaseOrder, setPurchaseOrder] = useState({
    purchaseOrderDate: "",
    purchaseOrderDeliveryDate: "",
    purchaseOrderTotalAmount: "",
    supplierId: "",
    salesOrderIds: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [salesorders, setSalesOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:8081/suppliers");
        setSuppliers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8081/orders");
        const validSalesOrders = response.data.filter(
          (salesorder) => salesorder.so_id !== null
        );

        const uniqueSalesOrders = Array.from(
          new Set(validSalesOrders.map((salesorder) => salesorder.so_id))
        );

        setSalesOrders(uniqueSalesOrders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSalesOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (e.target.multiple) {
      const selectedOptions = Array.from(e.target.options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setPurchaseOrder((prev) => ({ ...prev, [name]: selectedOptions }));
    } else {
      setPurchaseOrder((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const {
        purchaseOrderDate,
        purchaseOrderDeliveryDate,
        supplierId,
        salesOrderIds,
      } = purchaseOrder;

      const salesOrderIdsArray = Array.isArray(salesOrderIds)
        ? salesOrderIds
        : [salesOrderIds];

      const itemsPromises = salesOrderIdsArray.map(async (salesOrderId) => {
        const response = await axios.get(
          `http://localhost:8081/orders/${salesOrderId}`
        );
        return response.data;
      });

      const itemsArrays = await Promise.all(itemsPromises);

      const totalAmount = itemsArrays
        .flat()
        .reduce(
          (sum, orderItem) =>
            sum + orderItem.so_item_quantity * orderItem.product_supplierPrice,
          0
        );

      setPurchaseOrder((prev) => ({
        ...prev,
        purchaseOrderTotalAmount: totalAmount.toFixed(2),
      }));

      await axios.post("http://localhost:8081/purchaseorders", {
        po_orderDate: purchaseOrderDate,
        po_deliveryDate: purchaseOrderDeliveryDate,
        po_totalAmount: totalAmount.toFixed(2),
        supplier_id_fk: supplierId,
        salesOrderIds: salesOrderIdsArray,
      });

      navigate("/purchaseorders");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold">
          {" "}
          Add Purchase Order{" "}
        </h1>

        <div className="mb-2">
          <label> Order Date </label>
          <input type="date" name="purchaseOrderDate" onChange={handleChange} />
        </div>

        <label> Delivery Date </label>
        <input
          type="date"
          name="purchaseOrderDeliveryDate"
          onChange={handleChange}
        />

        <label>Sales Order</label>
        <select
          name="salesOrderIds"
          onChange={handleChange}
          value={purchaseOrder.salesOrderIds}
          multiple
        >
          {salesorders.map((salesOrderId) => (
            <option key={salesOrderId} value={salesOrderId}>
              {salesOrderId}
            </option>
          ))}
        </select>

        <label>Supplier</label>
        <select
          name="supplierId"
          onChange={handleChange}
          value={purchaseOrder.supplierId}
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
            SAVE PURCHASE ORDER
          </button>
        </div>
      </form>
    </div>
  );
}

export default PurchaseOrderAdd;
