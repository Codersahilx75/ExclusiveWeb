import React, { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import { getRecentOrders } from "./apis/ProductApi";

// Chart.js setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartData = {
  labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Business Growth",
      data: [30, 70, 20, 80, 60, 30, 50],
      borderColor: "#F5B301",
      backgroundColor: "rgba(255, 193, 7, 0.1)",
      borderWidth: 2,
      fill: true,
    },
  ],
};

function Recent() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderData = await getRecentOrders();
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching recent orders", error);
        toast.error("Error fetching recent orders");
      }
    };

    fetchOrders();
  }, []);

  const navigateToOrderDetails = (orderId) => {
    window.open(`/order-details/${orderId}`, "_blank");
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-4 border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-300">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Total Items</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td
                        className="p-3 font-mono text-blue-700 cursor-pointer hover:underline"
                        onClick={() => navigateToOrderDetails(order._id)}
                      >
                        {order._id.slice(-6)}
                      </td>
                      <td className="p-3">
                        <img
                          src={`${import.meta.env.VITE_API_HOST}/${order.cart[0]?.img}`}
                          alt={order.cart[0]?.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      </td>
                      <td className="p-3 text-sm">{order.cart[0]?.name}</td>
                      <td className="p-3 text-sm">{order.cart.length}</td>
                      <td
                        className={`p-3 text-sm flex items-center ${
                          order.status === "completed"
                            ? "text-green-600"
                            : order.status === "processing"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        <FaCircle className="mr-2 text-xs" />
                        {order.status}
                      </td>
                      <td className="p-3 text-sm font-semibold text-green-700">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-3 text-gray-500">
                      No recent orders available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Report */}
        <div className="bg-white p-4 border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Analytics Report</h2>
          <div className="mb-3">
            <p className="text-gray-600">Company Finance Growth</p>
            <p className="text-green-500 font-semibold">+45.14%</p>
          </div>
          <div className="mb-3">
            <p className="text-gray-600">Company Expenses Ratio</p>
            <p className="font-semibold">0.58%</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Business Risk Cases</p>
            <p className="font-semibold">Low</p>
          </div>

          {/* Chart */}
          <div className="h-40">
            <Line
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recent;
