import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import {
  placeCODOrder,
  createStripeCheckoutSession,
} from "../components/apis/ProductApi";

function BillingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || { cart: JSON.parse(localStorage.getItem("pendingOnlineOrder"))?.cart || [] };
  const { clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    streetAddress: "",
    townCity: "",
    phoneNumber: "",
    email: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        firstName: user.name || "",
        phoneNumber: user.mobile || "",
        email: user.email || "",
      }));
    }
  }, []);

  if (!cart.length) {
    navigate("/");
    return null;
  }

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.qty, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
    } else {
      if (!/^[A-Za-z]+$/.test(formData.firstName)) {
        newErrors.firstName = "Name must contain only alphabets";
      }
      if (formData.firstName.length < 2 || formData.firstName.length > 7) {
        newErrors.firstNameLength = "Name must be between 2-7 characters";
      }
    }

    if (!formData.streetAddress) {
      newErrors.streetAddress = "Street Address is required";
    } else if (
      formData.streetAddress.length < 5 ||
      formData.streetAddress.length > 50
    ) {
      newErrors.streetAddress = "Street Address must be between 5-50 characters";
    }

    if (!formData.townCity) newErrors.townCity = "Town/City is required";

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    } else {
      if (!/^[0-9]+$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone Number must contain only numbers";
      }
      if (formData.phoneNumber.length !== 10) {
        newErrors.phoneNumberLength = "Phone Number must be exactly 10 digits";
      }
    }

    if (!formData.email) {
      newErrors.email = "Email Address is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email (e.g., example@gmail.com)";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warn("Please correct the errors in the form");
      return;
    }

    const orderData = {
      ...formData,
      cart,
      totalPrice: getTotalPrice(),
    };

    setIsLoading(true);

    if (formData.paymentMethod === "cod") {
      try {
        const res = await placeCODOrder(orderData);
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/profile");
      } catch (err) {
        toast.error("Failed to place order");
      } finally {
        setIsLoading(false);
      }
    } else if (formData.paymentMethod === "online") {
      try {
        const response = await createStripeCheckoutSession(orderData);
        if (response.url) {
          localStorage.setItem("pendingOnlineOrder", JSON.stringify(orderData));
          window.location.href = response.url;
        } else {
          throw new Error(response.error || "Payment gateway error");
        }
      } catch (err) {
        console.error("Payment error details:", err.response?.data);
        toast.error(
          err.response?.data?.details ||
            err.response?.data?.error ||
            "Failed to initiate payment"
        );
        setIsLoading(false);
      }
    }
  };

  return (
    <UserLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">
          🧾 Billing Details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="space-y-4">
                {Object.entries(formData).map(([key, value]) => {
                  if (key === "paymentMethod") return null;
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700">
                        {key.replace(/([A-Z])/g, " $1").trim()}{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type={key === "email" ? "email" : "text"}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="mt-1 block w-full border p-2 rounded-lg bg-gray-100 border-gray-300"
                      />
                      {errors[key] && (
                        <p className="text-red-500 text-sm">{errors[key]}</p>
                      )}
                      {errors[`${key}Length`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`${key}Length`]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-600 mb-4">
                Order Summary
              </h3>
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`${import.meta.env.VITE_API_HOST}/${item.img}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{item.price} × {item.qty}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="form-radio text-indigo-600"
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === "online"}
                  onChange={handleChange}
                  className="form-radio text-indigo-600"
                />
                <span>Online Payment</span>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              {isLoading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  );
}

export default BillingPage;