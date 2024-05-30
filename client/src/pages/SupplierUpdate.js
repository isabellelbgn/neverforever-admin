import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SupplierUpdate() {
  const [supplier, setSupplier] = useState({
    supplierName: "",
    supplierContactPerson: "",
    supplierContactNumber: "",
    supplierEmailAddress: "",
    supplierShippingAddress: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const supplierId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/suppliers/${supplierId}`
        );
        const supplierData = response.data;

        setSupplier({
          supplierName: supplierData.supplier_name,
          supplierContactPerson: supplierData.supplier_contactPerson,
          supplierContactNumber: supplierData.supplier_contactNumber,
          supplierEmailAddress: supplierData.supplier_emailAddress,
          supplierShippingAddress: supplierData.supplier_shippingAddress,
        });
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    fetchSupplierData();
  }, [supplierId]);

  const handleChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/suppliers/update/${supplierId}`,
        supplier
      );
      navigate("/suppliers");
    } catch (err) {
      console.error("Error updating supplier:", err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Update Supplier </h1>

        <div className="mb-2">
          <label>Supplier Name</label>
          <input
            type="text"
            placeholder="Enter Supplier Name"
            name="supplierName"
            value={supplier.supplierName}
            onChange={handleChange}
          />
        </div>

        <label> Contact Person </label>
        <input
          type="text"
          placeholder="Enter Contact Person"
          name="supplierContactPerson"
          value={supplier.supplierContactPerson}
          onChange={handleChange}
        />

        <label> Contact Number </label>
        <input
          type="text"
          placeholder="Enter Contact Number"
          name="supplierContactNumber"
          value={supplier.supplierContactNumber}
          onChange={handleChange}
        />

        <label> Email Address </label>
        <input
          type="text"
          placeholder="Enter Email Address"
          name="supplierEmailAddress"
          value={supplier.supplierEmailAddress}
          onChange={handleChange}
        />

        <label> Shipping Address </label>
        <textarea
          placeholder="Enter Shipping Address"
          name="supplierShippingAddress"
          value={supplier.supplierShippingAddress}
          onChange={handleChange}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            {" "}
            SAVE SUPPLIER
          </button>
        </div>
      </form>
    </div>
  );
}

export default SupplierUpdate;
