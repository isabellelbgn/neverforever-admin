import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DiscountAdd() {
  const [productDiscount, setProductDiscount] = useState({
    productDiscountName: "",
    productDiscountCode: "",
    productDiscountPercentage: "",
    productDiscountValidFrom: "",
    productDiscountValidUntil: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setProductDiscount((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const {
        productDiscountName,
        productDiscountCode,
        productDiscountPercentage,
        productDiscountValidFrom,
        productDiscountValidUntil,
      } = productDiscount;
      await axios.post("http://localhost:8081/discounts", {
        product_discount_name: productDiscountName,
        product_discount_code: productDiscountCode,
        product_discount_percentage: productDiscountPercentage,
        product_discount_validFrom: productDiscountValidFrom,
        product_discount_validUntil: productDiscountValidUntil,
      });
      navigate("/discounts");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Add Discount </h1>

        <div className="mb-2">
          <label>Discount Name</label>
          <input
            type="text"
            placeholder="Enter Discount Name"
            name="productDiscountName"
            onChange={handleChange}
          />
        </div>

        <label> Discount Code </label>
        <input
          type="text"
          placeholder="Enter Discount Code"
          name="productDiscountCode"
          onChange={handleChange}
        />

        <label> Percentage </label>
        <input
          type="number"
          placeholder="Enter Percentage"
          name="productDiscountPercentage"
          onChange={handleChange}
        />

        <label> Valid From </label>
        <input
          type="datetime-local"
          name="productDiscountValidFrom"
          onChange={handleChange}
        />

        <label> Valid Until </label>
        <input
          type="datetime-local"
          name="productDiscountValidUntil"
          onChange={handleChange}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            {" "}
            SAVE PRODUCT DISCOUNT
          </button>
        </div>
      </form>
    </div>
  );
}

export default DiscountAdd;
