import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";

function Request() {
  const [request, setRequest] = useState([]);
  const [sortOption, setSortOption] = useState("id");

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const res = await axios.get("http://localhost:8081/requests");
        setRequest(res.data);
        applySorting(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllRequests();
  }, [sortOption]);

  const applySorting = (data) => {
    let sortedData = [...data];

    switch (sortOption) {
      case "idAsc":
        sortedData.sort((a, b) => a.rr_id - b.rr_id);
        break;
      case "idDesc":
        sortedData.sort((a, b) => b.rr_id - a.rr_id);
        break;
      default:
        break;
    }

    setRequest(sortedData);
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
            <option value="idAsc">Request ID (Ascending)</option>
            <option value="idDesc">Request ID (Descending)</option>
          </select>
        </div>
      </div>
      <table className="basic mt-10">
        <thead>
          <tr>
            <td> Request ID </td>
            <td> Type </td>
            <td> Reason </td>
            <td> Status </td>
            <td> Date </td>
            <td> Actions </td>
          </tr>
        </thead>
        <tbody>
          {request.map((data, i) => (
            <tr key={i}>
              <td>{data.rr_id}</td>
              <td>{data.rr_type}</td>
              <td>{data.rr_reason}</td>
              <td>{data.rr_status}</td>
              <td>{data.rr_createdAt}</td>
              <td>
                <button className="btn-green">
                  <Link to={`/requests/update/${data.rr_id}`}>
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

export default Request;
