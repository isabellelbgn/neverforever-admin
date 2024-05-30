import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function PurchaseOrder() {
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [supplierMapping, setSupplierMapping] = useState({});
  const [sortOption, setSortOption] = useState("id");

  useEffect(() => {
    const fetchAllPurchaseOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8081/purchaseorders");
        setPurchaseOrder(res.data);

        const supplierResponse = await axios.get(
          "http://localhost:8081/suppliers"
        );
        const suppliers = supplierResponse.data;
        const supplierMap = {};
        suppliers.forEach((supplier) => {
          supplierMap[supplier.supplier_id] = supplier.supplier_name;
        });
        setSupplierMapping(supplierMap);
        applySorting(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllPurchaseOrders();
  }, [sortOption]);

  const applySorting = (data) => {
    let sortedData = [...data];

    switch (sortOption) {
      case "poIdAsc":
        sortedData.sort((a, b) => a.po_id - b.po_id);
        break;
      case "poIdDesc":
        sortedData.sort((a, b) => b.po_id - a.po_id);
        break;
      case "orderDateAsc":
        sortedData.sort(
          (a, b) => new Date(a.po_orderDate) - new Date(b.po_orderDate)
        );
        break;
      case "orderDateDesc":
        sortedData.sort(
          (a, b) => new Date(b.po_orderDate) - new Date(a.po_orderDate)
        );
        break;
      default:
        break;
    }

    setPurchaseOrder(sortedData);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this purchase order?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8081/purchaseorders/" + id);
          Swal.fire(
            "Deleted!",
            "Your purchase order has been deleted.",
            "success"
          );
          window.location.reload();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the purchase order.",
            "error"
          );
        }
      }
    });
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
            <option value="poIdAsc">Purchase Order ID (Ascending)</option>
            <option value="poIdDesc">Purchase Order ID (Descending)</option>
            <option value="orderDateAsc">Order Date (Ascending)</option>
            <option value="orderDateDesc">Order Date (Descending)</option>
          </select>
        </div>

        <div>
          <Link
            to="/purchaseorders/add"
            className="px-4 py-2 ml-5 rounded-md bg-black text-white inline-block"
          >
            Add +
          </Link>
        </div>
      </div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Purchase Order ID </td>
            <td> Order Date </td>
            <td> Delivery Date </td>
            <td> Total Amount </td>
            <td> Supplier </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {purchaseOrder.map((data, i) => (
            <tr key={i}>
              <td>{data.po_id}</td>
              <td>{data.po_orderDate}</td>
              <td>{data.po_deliveryDate}</td>
              <td>{data.po_totalAmount}</td>
              <td>{supplierMapping[data.supplier_id_fk]}</td>
              <td>
                <button className="btn-green">
                  <Link to={`/purchaseorders/update/${data.po_id}`}>
                    <BiEdit />
                  </Link>
                </button>
                <button
                  className="btn-red"
                  onClick={() => handleDelete(data.po_id)}
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

export default PurchaseOrder;
