import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SupplierAdd() {
  const [supplier, setSupplier] = useState({
    supplierName: "",
    supplierContactPerson: "",
    supplierContactNumber: "",
    supplierEmailAddress: "",
    supplierShippingAddress: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setSupplier((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const {
        supplierName,
        supplierContactPerson,
        supplierContactNumber,
        supplierEmailAddress,
        supplierShippingAddress,
      } = supplier;
      await axios.post("http://localhost:8081/suppliers", {
        supplier_name: supplierName,
        supplier_contactPerson: supplierContactPerson,
        supplier_contactNumber: supplierContactNumber,
        supplier_emailAddress: supplierEmailAddress,
        supplier_shippingAddress: supplierShippingAddress,
      });
      navigate("/suppliers");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Add Supplier </h1>

        <div className="mb-2">
          <label>Supplier Name</label>
          <input
            type="text"
            placeholder="Enter Supplier Name"
            name="supplierName"
            onChange={handleChange}
          />
        </div>

        <label> Contact Person </label>
        <input
          type="text"
          placeholder="Enter Contact Person"
          name="supplierContactPerson"
          onChange={handleChange}
        />

        <label> Contact Number </label>
        <input
          type="text"
          placeholder="Enter Contact Number"
          name="supplierContactNumber"
          onChange={handleChange}
        />

        <label> Email Address </label>
        <input
          type="text"
          placeholder="Enter Email Address"
          name="supplierEmailAddress"
          onChange={handleChange}
        />

        <label> Shipping Address </label>
        <textarea
          placeholder="Enter Shipping Address"
          name="supplierShippingAddress"
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

export default SupplierAdd;
