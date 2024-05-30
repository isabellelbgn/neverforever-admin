import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdViewWeek,
  MdViewDay,
  MdCalendarMonth,
  MdShoppingCart,
  MdShoppingBag,
  MdPendingActions,
  MdLocalShipping,
  MdCancel,
} from "react-icons/md";

export default function Dashboard() {
  const [dayOrdersCount, setDayOrdersCount] = useState(0);
  const [weekOrdersCount, setWeekOrdersCount] = useState(0);
  const [monthOrdersCount, setMonthOrdersCount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [totalCustomersCount, setTotalCustomersCount] = useState(0);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [processedOrders, setProcessedOrders] = useState(0);
  const [requestedOrders, setRequestedOrders] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [adminName, setAdminName] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8081/login")
      .then((response) => {
        console.log("Login response:", response.data);
        const { adminName } = response.data;
        setAdminName(adminName);
      })
      .catch((error) => {
        console.error("Error checking login status:", error);
      });
  }, []);

  useEffect(() => {
    const fetchDayOrdersCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/orders/day/count"
        );
        setDayOrdersCount(response.data.count);
      } catch (error) {
        console.error("Error fetching day orders count:", error);
      }
    };

    fetchDayOrdersCount();
  }, []);

  useEffect(() => {
    const fetchWeekOrdersCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/orders/week/count"
        );
        setWeekOrdersCount(response.data.count);
      } catch (error) {
        console.error("Error fetching week orders count:", error);
      }
    };

    fetchWeekOrdersCount();
  }, []);

  useEffect(() => {
    const fetchMonthOrdersCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/orders/month/count"
        );
        setMonthOrdersCount(response.data.count);
      } catch (error) {
        console.error("Error fetching month orders count:", error);
      }
    };

    fetchMonthOrdersCount();
  }, []);

  useEffect(() => {
    const fetchTotalOrdersCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/orders/count"
        );
        setTotalOrdersCount(response.data.count);
      } catch (error) {
        console.error("Error fetching month orders count:", error);
      }
    };

    fetchTotalOrdersCount();
  }, []);

  useEffect(() => {
    const fetchCustomersCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/customers/count"
        );
        setTotalCustomersCount(response.data.count);
      } catch (error) {
        console.error("Error fetching month orders count:", error);
      }
    };

    fetchCustomersCount();
  }, []);

  useEffect(() => {
    const fetchProductsCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/products/count"
        );
        setTotalProductsCount(response.data.count);
      } catch (error) {
        console.error("Error fetching month orders count:", error);
      }
    };

    fetchProductsCount();
  }, []);

  useEffect(() => {
    const fetchPendingOrdersCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/orders/pending"
        );
        setPendingOrders(response.data.count);
      } catch (error) {
        console.error("Error fetching pending orders count:", error);
      }
    };

    fetchPendingOrdersCount();
  }, []);

  useEffect(() => {
    const fetchProcessedOrdersCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/orders/completed"
        );
        setProcessedOrders(response.data.count);
      } catch (error) {
        console.error("Error fetching processed orders count:", error);
      }
    };

    fetchProcessedOrdersCount();
  }, []);

  useEffect(() => {
    const fetchRequestedOrdersCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/orders/requested"
        );
        setRequestedOrders(response.data.count);
      } catch (error) {
        console.error("Error fetching requested orders count:", error);
      }
    };

    fetchRequestedOrdersCount();
  }, []);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/dashboard/orders/recentactivity"
        );
        setRecentActivity(response.data);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    fetchRecentActivity();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mt-6 mb-7">Dashboard</h1>
        <div className="flex items-center mt-6 mb-7">
          <p className="font-semibold mr-2">LOGGED IN</p>
          <p className="bg-slate-100 rounded-md p-2">{adminName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1 */}
        <div className="border-black border p-4 rounded-md bg-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{dayOrdersCount}</h2>
            <p>Orders Today</p>
          </div>
          <MdViewDay size={32} />
        </div>

        <div className="border-black border p-4 rounded-md bg-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{weekOrdersCount}</h2>
            <p>Orders This Week</p>
          </div>
          <MdViewWeek size={32} />
        </div>

        <div className="border-black border p-4 rounded-md bg-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{monthOrdersCount}</h2>
            <p>Orders This Month</p>
          </div>
          <MdCalendarMonth size={32} />
        </div>

        {/* Column 2 */}
        <div className="border-black border p-4 rounded-md bg-dbgreen flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{totalOrdersCount}</h2>
            <p> Total Orders </p>
          </div>
          <MdShoppingCart size={32} />
        </div>

        <div className="border-black border p-4 rounded-md bg-dbblue flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{totalCustomersCount}</h2>
            <p> Total Customers </p>
          </div>
          <MdShoppingCart size={32} />
        </div>

        <div className="border-black border p-4 rounded-md bg-dbpink flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{totalProductsCount}</h2>
            <p> Total Products </p>
          </div>
          <MdShoppingBag size={32} />
        </div>

        {/* Column 3 */}
        <div className="border-black border p-4 rounded-md bg-dbpink flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{pendingOrders}</h2>
            <p> Processing Orders </p>
          </div>
          <MdPendingActions size={32} />
        </div>

        <div className="border-black border p-4 rounded-md bg-dbgreen flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{processedOrders}</h2>
            <p> Completed Orders </p>
          </div>
          <MdLocalShipping size={32} />
        </div>

        <div className="border-black border p-4 rounded-md bg-dbblue flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{requestedOrders}</h2>
            <p> Return & Refund Requests </p>
          </div>
          <MdCancel size={32} />
        </div>

        {/* Column 4 */}
        <div className="col-span-3 border-black border p-4 rounded-md bg-slate-100">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <table className="w-full table-fixed text-left">
            <thead className="bg-header">
              <tr>
                <th className="w-1/4 py-2 px-4">Order ID</th>
                <th className="w-1/4 py-2 px-4">Customer</th>
                <th className="w-1/4 py-2 px-4">Order Status</th>
                <th className="w-1/4 py-2 px-4">Location</th>
                <th className="w-1/4 py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((order) => (
                <tr key={order.so_id} className="border">
                  <td className="py-2 px-4">{order.so_id}</td>
                  <td className="py-2 px-4">
                    {order.shipping_address_firstName}{" "}
                    {order.shipping_address_lastName}
                  </td>
                  <td className="py-2 px-4">{order.so_orderStatus}</td>
                  <td className="py-2 px-4">{order.shipping_address_city}</td>
                  <td className="py-2 px-4">{order.so_totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
