import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUpload } from "react-icons/fi";

function ProductUpdate() {
  const [product, setProduct] = useState({
    productName: "",
    productImage: "",
    productDescription: "",
    productUnitPrice: "",
    productAvailabilityStatus: "",
    productCategoryId: "",
    productCreatedAt: "",
    supplierId: "",
    productDiscountId: "",
  });

  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productDiscounts, setProductDiscounts] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const productId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8081/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching product categories:", error);
      }
    };

    fetchProductCategories();
  }, []);

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
    const fetchProductDiscounts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/discounts");
        setProductDiscounts(response.data);
      } catch (error) {
        console.error("Error fetching product discounts:", error);
      }
    };
    fetchProductDiscounts();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/products/${productId}`
        );
        const productData = response.data;

        setProduct((prevProduct) => ({
          ...prevProduct,
          productName: productData.product_name,
          productJewelryTone: productData.product_jewelryTone,
          productDescription: productData.product_description,
          productUnitPrice: productData.product_unitPrice,
          productAvailabilityStatus: productData.product_availabilityStatus,
          productCategoryId: productData.product_category_id,
          productImage: productData.product_image,
          supplierId: productData.supplier_id,
          productDiscountId: productData.product_discount_id,
        }));

        setCurrentImage(productData.product_image);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProductData();
  }, [productId]);

  useEffect(() => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productCreatedAt: product.productCreatedAt,
    }));
  }, []);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedImage = await uploadImageToServer(file);
      if (uploadedImage) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          productImage: uploadedImage,
        }));
        setImageChanged(true);

        if (currentImage) {
          const filename = currentImage.substring(
            currentImage.lastIndexOf("/") + 1
          );
          try {
            await deleteImageFromServer(filename);
          } catch (error) {
            console.error("Error deleting current image:", error);
          }
        }
      }
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = `${currentDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${currentDate.getDate()}`.padStart(2, "0");
    const hours = `${currentDate.getHours()}`.padStart(2, "0");
    const minutes = `${currentDate.getMinutes()}`.padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    setProduct((prevProduct) => ({
      ...prevProduct,
      productCreatedAt: formattedDate,
    }));
  }, []);

  const uploadImageToServer = async (file) => {
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await axios.post(
        "http://localhost:8081/products/add/upload",
        data
      );
      return `http://localhost:8081/images/${response.data.images[0]}`;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const deleteImageFromServer = async (filename) => {
    try {
      await axios.delete(`http://localhost:8081/images/${filename}`);
    } catch (error) {
      console.error("Error deleting current image:", error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        productName: product.productName,
        productJewelryTone: product.productJewelryTone,
        productDescription: product.productDescription,
        productUnitPrice: product.productUnitPrice,
        productAvailabilityStatus: product.productAvailabilityStatus,
        productCategoryId: product.productCategoryId,
        productImages: product.productImage,
        productCreatedAt: product.productCreatedAt,
        supplierId: product.supplierId,
        productDiscountId: product.productDiscountId,
      };

      const updateResponse = await axios.put(
        `http://localhost:8081/products/update/${productId}`,
        productData
      );

      if (updateResponse.status === 200) {
        navigate("/products");
      } else {
        console.error("Product update failed.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <form>
        <h1 className="mt-7 mb-5 text-md font-semibold"> Update Product </h1>

        <div className="mb-2">
          <label>Product Name</label>
          <input
            type="text"
            placeholder="Enter Product Name"
            name="productName"
            value={product.productName}
            onChange={handleChange}
          />
        </div>

        <label>Jewelry Tone</label>
        <select
          name="productJewelryTone"
          onChange={handleChange}
          value={product.productJewelryTone}
        >
          <option value=""></option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
        </select>

        <label>Photos</label>
        <div className="mb-2">
          <label className="w-24 h-auto text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 bg-gray-200 rounded-lg cursor-pointer">
            {currentImage ? (
              <img
                src={currentImage}
                alt="Current Product"
                width="100"
                height="100"
              />
            ) : (
              <FiUpload />
            )}
            <div>{currentImage ? "Change" : "Upload"}</div>
            <input type="file" onChange={uploadImage} className="hidden" />
          </label>
          {newImage && (
            <div>
              <img src={newImage} alt="New Product" width="100" height="100" />
            </div>
          )}
        </div>

        <label>Product Category</label>
        <select
          name="productCategoryId"
          value={product.productCategoryId}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option
              key={category.product_category_id}
              value={category.product_category_id}
            >
              {category.product_category_name}
            </option>
          ))}
        </select>

        <label> Description </label>
        <textarea
          placeholder="Enter Description"
          name="productDescription"
          value={product.productDescription}
          onChange={handleChange}
        />

        <label> Unit Price (in PHP) </label>
        <input
          type="number"
          placeholder="Enter Unit Price"
          name="productUnitPrice"
          value={product.productUnitPrice}
          onChange={handleChange}
        />

        <label>Availability Status</label>
        <select
          name="productAvailabilityStatus"
          value={product.productAvailabilityStatus}
          onChange={handleChange}
        >
          <option value=""></option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>

        <label>Supplier</label>
        <select
          name="supplierId"
          onChange={handleChange}
          value={product.supplierId}
        >
          <option value=""></option>
          {suppliers.map((supplier) => (
            <option key={supplier.supplier_id} value={supplier.supplier_id}>
              {supplier.supplier_name}
            </option>
          ))}
        </select>

        <label>Product Discount</label>
        <select
          name="productDiscountId"
          onChange={handleChange}
          value={product.productDiscountId}
        >
          <option value=""></option>
          {productDiscounts.map((productDiscount) => (
            <option
              key={productDiscount.product_discount_id}
              value={productDiscount.product_discount_id}
            >
              {productDiscount.product_discount_code}
            </option>
          ))}
        </select>

        <label> Created At </label>
        <input
          type="datetime-local"
          name="productCreatedAt"
          value={product.productCreatedAt}
          readOnly
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleClick}
            type="submit"
            className="px-4 py-1 rounded-md bg-black text-white text-base"
          >
            SAVE PRODUCT
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductUpdate;
