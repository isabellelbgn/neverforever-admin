import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";

function RequestLog() {
  const [requestLog, setRequestLog] = useState([]);

  useEffect(() => {
    const fetchAllRequestLogs = async () => {
      try {
        const res = await axios.get("http://localhost:8081/requestlogs");
        setRequestLog(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllRequestLogs();
  }, []);

  return (
    <>
      <div className="flex justify-end m-2 mb-5 mt-6"></div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Request Log ID </td>
            <td> Request ID </td>
            <td> Message </td>
            <td> Admin </td>
            <td> Date </td>
          </tr>
        </thead>
        <tbody>
          {requestLog.map((data, i) => (
            <tr key={i}>
              <td>{data.request_log_id}</td>
              <td>{data.request_id_fk}</td>
              <td>{data.request_log_message}</td>
              <td>{data.admin_id_fk}</td>
              <td>{data.request_log_timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default RequestLog;
