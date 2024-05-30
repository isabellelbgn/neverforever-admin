import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";

function DeliveryLog() {
  const [deliveryLog, setDeliveryLog] = useState([]);

  useEffect(() => {
    const fetchAllDeliveryLogs = async () => {
      try {
        const res = await axios.get("http://localhost:8081/deliverylogs");
        setDeliveryLog(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllDeliveryLogs();
  }, []);

  return (
    <>
      <div className="flex justify-end m-2 mb-5 mt-6"></div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Delivery Log ID </td>
            <td> Sales Order ID </td>
            <td> Message </td>
            <td> Reference </td>
            <td> Admin </td>
            <td> Date </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {deliveryLog.map((data, i) => (
            <tr key={i}>
              <td>{data.log_id}</td>
              <td>{data.so_id_fk}</td>
              <td>{data.log_message}</td>
              <td>{data.log_reference}</td>
              <td>{data.admin_id_fk}</td>
              <td>{data.log_timestamp}</td>
              <td>
                <button className="btn-green">
                  <Link to={`/deliverylogs/update/${data.log_id}`}>
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

export default DeliveryLog;
