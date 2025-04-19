import React, { useEffect, useState } from "react";
import { getAllOrders } from "../apis/ProductApi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchStr = searchQuery.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchStr) ||
      order.firstName?.toLowerCase().includes(searchStr) ||
      order.email?.toLowerCase().includes(searchStr) ||
      order.phoneNumber?.toString().includes(searchStr) ||
      order.totalPrice?.toString().includes(searchStr)
    );
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePerPageChange = (e) => {
    setOrdersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const navigateToOrderDetails = (orderId) => {
    window.open(`/order-details/${orderId}`, "_blank");
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return (
      <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-md border ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <FaArrowLeft />
        </button>

        {pageNumbers.map((num, index) => (
          <button
            key={index}
            onClick={() => typeof num === "number" && setCurrentPage(num)}
            className={`px-3 py-1 rounded-md ${
              currentPage === num
                ? "bg-blue-50 border-blue-500 text-blue-600 border"
                : "text-blue-500 hover:bg-blue-400 hover:text-white"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md border ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📦 All Orders</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="perPage" className="text-sm text-gray-600">
                Show:
              </label>
              <select
                id="perPage"
                value={ordersPerPage}
                onChange={handlePerPageChange}
                className="border border-gray-300 rounded px-2 py-2 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-800 text-white text-sm">
                  <tr>
                    <th className="p-3">Sr. No.</th>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Products</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order, index) => (
                      <tr key={order._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">
                          {(currentPage - 1) * ordersPerPage + index + 1}
                        </td>
                        <td
                          className="p-3 font-mono text-blue-700 cursor-pointer hover:underline"
                          onClick={() => navigateToOrderDetails(order._id)}
                        >
                          {order._id.slice(-6)}
                        </td>
                        <td className="p-3">
                          <div>
                            <strong>Name: {order.firstName}</strong>
                          </div>
                          <div className="text-xs text-gray-500">
                            Email: {order.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            Mobile: {order.phoneNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            Address: {order.streetAddress}, {order.townCity}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-green-600">
                          ₹{order.totalPrice}
                        </td>
                        <td className="p-3">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              order.paymentMethod === "card"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.paymentMethod === "card"
                              ? "Online Payment"
                              : "Cash on Delivery"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 space-y-1">
                          {order.cart.map((item) => (
                            <div
                              key={item.productId}
                              className="flex items-center space-x-2"
                            >
                              <img
                                src={`${import.meta.env.VITE_API_HOST}/${
                                  item.img
                                }`}
                                alt={item.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                              <span className="text-xs text-gray-700">
                                {item.name} (x{item.qty})
                              </span>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-6 text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {filteredOrders.length === 0 ? 0 : indexOfFirstOrder + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastOrder, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span>{" "}
                entries
              </div>

              {totalPages > 1 && renderPagination()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AllOrdersPage;
