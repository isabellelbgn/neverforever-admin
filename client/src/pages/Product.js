import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Product() {
  const [product, setProduct] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState({});
  const [supplierMapping, setSupplierMapping] = useState({});
  const [productDiscountMapping, setProductDiscountMapping] = useState({});
  const [sortOption, setSortOption] = useState("name");

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength) + "...";
    }
  }

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8081/products");
        setProduct(res.data);

        const categoryResponse = await axios.get(
          "http://localhost:8081/categories"
        );
        const categories = categoryResponse.data;
        const categoryMap = {};
        categories.forEach((category) => {
          categoryMap[category.product_category_id] =
            category.product_category_name;
        });
        setCategoryMapping(categoryMap);

        const supplierResponse = await axios.get(
          "http://localhost:8081/suppliers"
        );
        const suppliers = supplierResponse.data;
        const supplierMap = {};
        suppliers.forEach((supplier) => {
          supplierMap[supplier.supplier_id] = supplier.supplier_name;
        });
        setSupplierMapping(supplierMap);

        const productDiscountResponse = await axios.get(
          "http://localhost:8081/discounts"
        );
        const productDiscounts = productDiscountResponse.data;
        const productDiscountMap = {};
        productDiscounts.forEach((productDiscount) => {
          productDiscountMap[productDiscount.product_discount_id] =
            productDiscount.product_discount_code;
        });
        setProductDiscountMapping(productDiscountMap);

        applySorting(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllProducts();
  }, [sortOption]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8081/products/${id}`);
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
          window.location.reload();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the product.",
            "error"
          );
        }
      }
    });
  };

  const applySorting = (data) => {
    let sortedData = [...data];

    switch (sortOption) {
      case "nameAsc":
        sortedData.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case "nameDesc":
        sortedData.sort((a, b) => b.product_name.localeCompare(a.product_name));
        break;
      case "idAsc":
        sortedData.sort((a, b) => a.product_id - b.product_id);
        break;
      case "idDesc":
        sortedData.sort((a, b) => b.product_id - a.product_id);
        break;
      case "priceAsc":
        sortedData.sort((a, b) => a.product_unitPrice - b.product_unitPrice);
        break;
      case "priceDesc":
        sortedData.sort((a, b) => b.product_unitPrice - a.product_unitPrice);
        break;
      default:
        break;
    }

    setProduct(sortedData);
  };

  return (
    <>
      <div className="flex justify-end m-2 mb-5 mt-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="sortOption" className="w-20">
            Sort By:
          </label>
          <select
            className="form-control mt-2"
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="nameAsc">Product Name (A-Z)</option>
            <option value="nameDesc"> Product Name (Z-A)</option>
            <option value="idAsc">Product ID (Ascending)</option>
            <option value="idDesc">Product ID (Descending)</option>
            <option value="priceAsc">Price (Ascending)</option>
            <option value="priceDesc">Price (Descending)</option>
          </select>
        </div>

        <div>
          <Link
            to="/products/add"
            className="px-4 py-2 ml-5 rounded-md bg-black text-white inline-block"
          >
            Add +
          </Link>
        </div>
      </div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Product ID </td>
            <td> Name </td>
            <td> Jewelry Tone</td>
            <td> Category </td>
            <td> Unit Price </td>
            <td> Availability Status </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {product.map((data, i) => (
            <tr key={i}>
              <td>{data.product_id}</td>
              <td>{data.product_name}</td>
              <td>{data.product_jewelryTone}</td>
              <td>{categoryMapping[data.product_category_id_fk]}</td>
              <td>{data.product_unitPrice}</td>
              <td>{data.product_availabilityStatus}</td>
              <td>
                <button className="btn-green">
                  <Link to={`/products/update/${data.product_id}`}>
                    <BiEdit />
                  </Link>
                </button>
                <button
                  className="btn-red"
                  onClick={() => handleDelete(data.product_id)}
                >
                  <MdOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Product;
