import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";

function Payment() {
  const [paymentVerification, setPaymentVerification] = useState([]);

  useEffect(() => {
    const fetchAllPaymentVerifications = async () => {
      try {
        const res = await axios.get("http://localhost:8081/payments");
        setPaymentVerification(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllPaymentVerifications();
  }, []);

  return (
    <>
      <div className="flex justify-end m-2 mb-5 mt-6"></div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Payment ID </td>
            <td> Sales Order ID </td>
            <td> Message </td>
            <td> Reference </td>
            <td> Admin </td>
            <td> Date </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {paymentVerification.map((data, i) => (
            <tr key={i}>
              <td>{data.verification_id}</td>
              <td>{data.so_id_fk}</td>
              <td>{data.verification_message}</td>
              <td>{data.verification_reference}</td>
              <td>{data.admin_id_fk}</td>
              <td>{data.verification_timestamp}</td>
              <td>
                <button className="btn-green">
                  <Link to={`/payments/update/${data.verification_id}`}>
                    <BiEdit />
                  </Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Payment;
