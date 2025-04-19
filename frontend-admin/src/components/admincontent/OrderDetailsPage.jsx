import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOrderById } from "../apis/ProductApi";

function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true); // State for showing loader

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    // Fetch order details when component mounts
    fetchOrderDetails();

    // Hide loader after 5 seconds and show order details
    setTimeout(() => {
      setShowLoader(false); // Hide loader after 5 seconds
    }, 1000);
  }, [orderId]);

  if (showLoader) {
    // Display loader while waiting for the order details
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="text-center py-16 text-indigo-600 font-semibold text-xl">
        Loading order details...
      </div>
    );
  if (!order)
    return (
      <div className="text-center py-16 text-red-600 font-semibold text-xl">
        Order not found
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8">Order Detail</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Order Summary */}
          <div className="bg-indigo-100 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">🧾 Order Summary</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                <span className="font-medium">Order ID:</span> {order._id}
              </p>
              <p>
                <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "delivered"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.paymentMethod === "card" ? "Online Payment" : "Cash on Delivery"}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span> {order.paymentStatus}
              </p>
              {order.stripePaymentId && (
                <p>
                  <span className="font-medium">Transaction ID:</span> {order.stripePaymentId}
                </p>
              )}
              <p className="text-lg font-bold mt-4">
                <span className="text-slate-800">Total:</span> ₹{order.totalPrice}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-yellow-100 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">👤 Customer Info</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                <span className="font-medium">Name:</span> {order.firstName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.phoneNumber}
              </p>
              <p>
                <span className="font-medium">Address:</span> {order.streetAddress}, {order.townCity}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">📦 Order Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-700">
              <thead className="bg-indigo-100 text-indigo-700 text-sm uppercase">
                <tr>
                  <th className="p-3">Sr. No.</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.cart.map((item, index) => (
                  <tr key={item.productId} className="border-b hover:bg-indigo-50 transition">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`${import.meta.env.VITE_API_HOST}/${item.img}`}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <span>{item.name}</span>
                    </td>
                    <td className="p-3">₹{item.price}</td>
                    <td className="p-3">{item.qty}</td>
                    <td className="p-3 font-medium">₹{(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-red-100 p-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">📅 Order Timeline</h2>
          <div className="space-y-6">
            <TimelineItem color="green" title="Order Placed" date={order.createdAt} />
            {order.shippedAt && <TimelineItem color="blue" title="Shipped" date={order.shippedAt} />}
            {order.deliveredAt && (
              <TimelineItem color="emerald" title="Delivered" date={order.deliveredAt} />
            )}
            {order.cancelledAt && <TimelineItem color="red" title="Cancelled" date={order.cancelledAt} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline component
function TimelineItem({ color, title, date }) {
  const colorMap = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    red: "bg-red-500",
  };

  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 w-4 h-4 rounded-full ${colorMap[color]} mt-1`}></div>
      <div className="ml-4">
        <p className="font-semibold text-slate-800">{title}</p>
        <div className="text-sm text-slate-500">
          <p>
            <strong>Date:</strong> {new Date(date).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {new Date(date).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
