import React, { useState, useEffect } from "react";
import "./OrderModal.css";

export default function Modal({ so_id, onClose }) {
  const [modal, setModal] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (so_id) {
      fetchOrderDetails();
    }
  }, [so_id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8081/orders/${so_id}`);
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const closeModal = () => {
    setModal(false);
    onClose && onClose();
  };

  return (
    <>
      {modal && (
        <div className="modal">
          <div onClick={closeModal} className="overlay"></div>
          <div className="modal-content">
            <h2 className="text-xl font-semibold"> Order Details </h2>
            {orderDetails && orderDetails.length > 0 ? (
              <>
                <p> Order #: {orderDetails[0].so_id} </p>
                <p> Order Date: {orderDetails[0].so_orderDate} </p>
                <p> Payment Status: {orderDetails[0].so_paymentMethod} </p>
                <p> Payment Status: {orderDetails[0].so_paymentStatus} </p>
                <p> Order Status: {orderDetails[0].so_orderStatus} </p>

                <h3>Product Details</h3>
                <table className="modal-table">
                  <thead>
                    <tr>
                      <td>Product</td>
                      <td>Quantity</td>
                      <td>Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((orderItem, index) => (
                      <tr key={orderItem.so_item_id}>
                        <td className="product-cell">
                          <div className="product-info">
                            <img
                              src={orderItem.product_image}
                              alt="Product"
                              className="product-image"
                            />
                            <div className="product-details">
                              <p>{orderItem.product_name}</p>
                              <p>{orderItem.so_item_jewelryLength}</p>
                              <p>{orderItem.so_item_jewelryTextFront}</p>
                              <p>{orderItem.so_item_jewelryTextBack}</p>
                              <p>{orderItem.so_item_jewelryFont}</p>
                            </div>
                          </div>
                        </td>
                        <td>{orderItem.so_item_quantity}</td>
                        <td>{orderItem.so_item_unitPrice}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="total-cell font-semibold" colSpan="2">
                        {" "}
                        TOTAL:{" "}
                      </td>
                      <td> P{orderDetails[0].so_totalAmount}</td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  Delivery To: {orderDetails[0].shipping_address_firstName}{" "}
                  {orderDetails[0].shipping_address_lastName}
                </p>
                <p>
                  Address:{" "}
                  {`${orderDetails[0].shipping_address_streetOne}, ${orderDetails[0].shipping_address_streetTwo}, ${orderDetails[0].shipping_address_city}, ${orderDetails[0].shipping_address_province}, ${orderDetails[0].shipping_address_zipCode}`}
                </p>
                <p>
                  Contact:{" "}
                  {`${orderDetails[0].shipping_address_emailAddress}, ${orderDetails[0].shipping_address_contactNum}`}
                </p>
              </>
            ) : (
              <p>No order details available.</p>
            )}
            <button className="close-modal" onClick={closeModal}>
              {" "}
              CLOSE{" "}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
