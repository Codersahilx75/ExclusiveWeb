import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import { getUserOrders, cancelOrder } from "../components/apis/ProductApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      try {
        const userOrders = await getUserOrders(parsedUser.email); // Changed to use email instead of _id
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [navigate]);

  useEffect(() => {
    setCurrentPage(1); // reset page when orders update
  }, [orders]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearCart();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleCancelOrder = (orderId) => {
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to cancel this order?</p>
        <div className="flex justify-center gap-4 mt-2">
          <button
            className="px-4 py-1 bg-green-500 text-white rounded"
            onClick={() => {
              if (toast.isActive(toastId)) {
                toast.dismiss(toastId); // Safely dismiss the toast
              }
              confirmCancelOrder(orderId);
            }}
          >
            Yes
          </button>
          <button
            className="px-4 py-1 bg-red-500 text-white rounded"
            onClick={() => {
              if (toast.isActive(toastId)) {
                toast.dismiss(toastId); // Safely dismiss the toast
              }
            }}
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  const confirmCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      const updatedOrders = await getUserOrders(user.email); // Changed to use email
      setOrders(updatedOrders);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to cancel order");
    }
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const Pagination = () => {
    const maxButtons = 5;
    let pages = [];

    const addPageButton = (page) => {
      pages.push(
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded-lg text-sm font-semibold ${
            currentPage === page
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {page}
        </button>
      );
    };

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) addPageButton(i);
    } else {
      addPageButton(1);

      if (currentPage > 3) pages.push(<span key="dots-start">...</span>);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) addPageButton(i);

      if (currentPage < totalPages - 2)
        pages.push(<span key="dots-end">...</span>);

      addPageButton(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          <FaArrowLeft />
        </button>

        {pages}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    );
  };

  if (!user || loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <UserLayout>
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Profile Info */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-10">
          <h2 className="text-3xl font-bold mb-4">👤 Hello, {user.name}!</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm md:text-base">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Mobile:</strong> {user.mobile || "Not provided"}
            </p>
            <div className="md:text-right">
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-indigo-700">
            🛒 Your Orders
          </h3>
          {orders.length === 0 ? (
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          ) : (
            <>
              <div className="space-y-6">
                {currentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-xl p-5 flex flex-col gap-4 bg-gray-50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-sm md:text-base">
                          Order #{order._id.slice(-6).toUpperCase()} •{" "}
                          <span className="text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Payment Method:{" "}
                          <span className="capitalize font-medium">
                            {order.paymentMethod === "card"
                              ? "Online Payment"
                              : "Cash on Delivery"}
                          </span>{" "}
                          {order.paymentMethod === "card" && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-1">
                              {order.paymentStatus === "completed"
                                ? "Paid"
                                : order.paymentStatus}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-2 md:mt-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            order.status === "processing"
                              ? "bg-yellow-200 text-yellow-800"
                              : order.status === "shipped"
                              ? "bg-blue-200 text-blue-800"
                              : order.status === "delivered"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                        {order.status === "processing" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="text-red-500 hover:underline text-xs"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-4">
                      {order.cart.map((item) => (
                        <div
                          key={item.productId}
                          className="flex gap-4 items-center"
                        >
                          <img
                            src={`${import.meta.env.VITE_API_HOST}/${item.img}`}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-gray-600 text-sm">
                              ₹{item.price} × {item.qty} = ₹
                              {(item.price * item.qty).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t pt-3">
                      <p className="font-semibold text-indigo-600 text-sm md:text-base">
                        Total: ₹{order.totalPrice.toFixed(2)}
                      </p>
                      {order.status === "cancelled" && order.cancelledAt && (
                        <p className="text-red-500 text-sm">
                          Cancelled on{" "}
                          {new Date(order.cancelledAt).toLocaleDateString()}
                        </p>
                      )}
                      {order.paymentStatus === "refunded" && (
                        <p className="text-green-500 text-sm">
                          Refund Successful
                        </p>
                      )}
                      {order.status === "delivered" && order.deliveredAt && (
                        <p className="text-green-500 text-sm">
                          Delivered on{" "}
                          {new Date(order.deliveredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

                {/* Pagination */}
              {totalPages > 1 && <Pagination />}
            </>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default Profile;
