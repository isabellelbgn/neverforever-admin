import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function DiscountUpdate() {
  const [productDiscount, setProductDiscount] = useState({
    productDiscountName: "",
    productDiscountCode: "",
    productDiscountPercentage: "",
    productDiscountValidFrom: "",
    productDiscountValidUntil: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const productDiscountId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchProductDiscountData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/discounts/${productDiscountId}`
        );
        const productDiscountData = response.data;

        setProductDiscount({
          productDiscountName: productDiscountData.product_discount_name,
          productDiscountCode: productDiscountData.product_discount_code,
          productDiscountPercentage:
            productDiscountData.product_discount_percentage,
          productDiscountValidFrom:
            productDiscountData.product_discount_validFrom,
          productDiscountValidUntil:
            productDiscountData.product_discount_validUntil,
        });
      } catch (error) {
        console.error("Error fetching product discount data:", error);
      }
    };
    fetchProductDiscountData();
  }, [productDiscountId]);

  const handleChange = (e) => {
    setProductDiscount({
      ...productDiscount,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/discounts/update/${productDiscountId}`,
        productDiscount
      );
      navigate("/discounts");
    } catch (err) {
      console.error("Error updating product discount:", err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Update Discount </h1>

        <div className="mb-2">
          <label>Discount Name</label>
          <input
            type="text"
            placeholder="Enter Discount Name"
            name="productDiscountName"
            value={productDiscount.productDiscountName}
            onChange={handleChange}
          />
        </div>

        <label> Discount Code </label>
        <input
          type="text"
          placeholder="Enter Discount Code"
          name="productDiscountCode"
          value={productDiscount.productDiscountCode}
          onChange={handleChange}
        />

        <label> Percentage </label>
        <input
          type="number"
          placeholder="Enter Percentage"
          name="productDiscountPercentage"
          value={productDiscount.productDiscountPercentage}
          onChange={handleChange}
        />

        <label> Valid From </label>
        <input
          type="datetime-local"
          name="productDiscountValidFrom"
          value={productDiscount.productDiscountValidFrom}
          onChange={handleChange}
        />

        <label> Valid Until </label>
        <input
          type="datetime-local"
          name="productDiscountValidUntil"
          value={productDiscount.productDiscountValidUntil}
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

export default DiscountUpdate;
