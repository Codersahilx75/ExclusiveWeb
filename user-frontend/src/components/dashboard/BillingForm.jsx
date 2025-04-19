// src/components/BillingForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { createPaymentIntent, placeOrder } from "../apis/ProductApi";

function BillingForm({ cart, getTotalPrice, clearCart }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    streetAddress: "",
    townCity: "",
    phoneNumber: "",
    email: "",
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warn("Please correct the errors in the form");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe has not been initialized");
      return;
    }

    setIsLoading(true);

    try {
      const totalPrice = Number(getTotalPrice()).toFixed(2);
      const { clientSecret } = await createPaymentIntent(totalPrice);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.firstName,
            email: formData.email,
            phone: formData.phoneNumber,
            address: {
              line1: formData.streetAddress,
              city: formData.townCity
            }
          },
        },
        receipt_email: formData.email,
      });

      if (error) throw error;

      if (paymentIntent.status === "succeeded") {
        const orderData = {
          ...formData,
          cart: cart.map((item) => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            img: item.img,
          })),
          totalPrice: parseFloat(totalPrice),
          paymentMethod: "card",
          stripePaymentId: paymentIntent.id,
        };

        await placeOrder(orderData);
        toast.success("Payment successful and order placed!");
        clearCart();
        navigate("/profile");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment or order failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">
                {key.replace(/([A-Z])/g, " $1").trim()} *
              </label>
              <input
                type={key === "email" ? "email" : "text"}
                name={key}
                value={value}
                onChange={handleChange}
                className="mt-1 block w-full border p-2 rounded-lg bg-gray-100 border-gray-300"
              />
              {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
              {errors[`${key}Length`] && (
                <p className="text-red-500 text-sm">{errors[`${key}Length`]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Details *
            </label>
            <div className="border p-3 rounded bg-white">
              <CardElement />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            {isLoading ? "Processing Payment..." : "Place Order & Pay"}
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-600 mb-4">Order Summary</h3>
        {cart.map((item) => (
          <div key={item._id} className="flex justify-between mb-2">
            <span>{item.name} x {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
          <span>Total</span>
          <span>₹{getTotalPrice()}</span>
        </div>
      </div>
    </div>
  );
}

export default BillingForm;
