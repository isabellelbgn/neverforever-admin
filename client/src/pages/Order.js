import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import OrderModal from "../components/Modal/OrderModal";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

function Order() {
  const [order, setOrder] = useState([]);
  const [productMapping, setProductMapping] = useState({});
  const [shipmentMapping, setShipmentMapping] = useState({});
  const [sortOption, setSortOption] = useState("id");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const groupedOrders = order.reduce((acc, currentOrder) => {
    const existingOrder = acc.find(
      (order) => order.so_id === currentOrder.so_id
    );

    if (existingOrder) {
      existingOrder.items.push({
        product_name: productMapping[currentOrder.product_id_fk],
      });
    } else {
      const newOrder = {
        ...currentOrder,
        items: [
          {
            product_name: productMapping[currentOrder.product_id_fk],
          },
        ],
      };
      acc.push(newOrder);
    }

    return acc;
  }, []);

  const applySorting = (data) => {
    let sortedData = [...data];

    switch (sortOption) {
      case "soIdAsc":
        sortedData.sort((a, b) => a.so_id - b.so_id);
        break;
      case "soIdDesc":
        sortedData.sort((a, b) => b.so_id - a.so_id);
        break;
      case "soDateAsc":
        sortedData.sort(
          (a, b) => new Date(a.so_orderDate) - new Date(b.so_orderDate)
        );
        break;
      case "soDateDesc":
        sortedData.sort(
          (a, b) => new Date(b.so_orderDate) - new Date(a.so_orderDate)
        );
        break;
      default:
        break;
    }

    setOrder(sortedData);
  };

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8081/orders");
        setOrder(res.data);

        const productResponse = await axios.get(
          "http://localhost:8081/products"
        );
        const products = productResponse.data;
        const productMap = {};
        products.forEach((product) => {
          productMap[product.product_id] = product.product_name;
        });
        setProductMapping(productMap);

        const shipmentResponse = await axios.get(
          "http://localhost:8081/shipments"
        );
        const shipments = shipmentResponse.data;
        const shipmentMap = {};
        shipments.forEach((shipment) => {
          shipmentMap[shipment.shipping_id] = shipment.shipping_method;
        });
        setShipmentMapping(shipmentMap);

        applySorting(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllOrders();
    // eslint-disable-next-line
  }, [sortOption]);

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
            <option value="soIdAsc">Sales Order ID (Ascending)</option>
            <option value="soIdDesc">Sales Order ID (Descending)</option>
            <option value="soDateAsc">Order Date (Ascending)</option>
            <option value="soDateDesc">Order Date (Descending)</option>
          </select>
        </div>
      </div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Order ID </td>
            <td> Date </td>
            <td> Total </td>
            <td> Payment Status </td>
            <td> Order Status </td>
            <td> Shipment </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {groupedOrders.map((data, i) => (
            <tr key={i}>
              <td>{data.so_id}</td>
              <td>{data.so_orderDate}</td>
              <td>{data.so_totalAmount}</td>
              <td>{data.so_paymentStatus}</td>
              <td>{data.so_orderStatus}</td>
              <td>{shipmentMapping[data.shipping_id_fk]}</td>

              <td>
                <button
                  className="btn-blue"
                  onClick={() => {
                    setSelectedOrderId(data.so_id);
                  }}
                >
                  <HiMiniMagnifyingGlass />
                </button>
                <button className="btn-green">
                  <Link to={`/orders/update/${data.so_id}`}>
                    <BiEdit />
                  </Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrderId && (
        <OrderModal
          so_id={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </>
  );
}

export default Order;
