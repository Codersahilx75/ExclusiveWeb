import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import UserLayout from "../layouts/UserLayout";
import StripePaymentForm from "../components/StripePaymentForm";
import { placeOrder, createPaymentIntent } from "../components/apis/ProductApi";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

function BillingPageContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || { cart: [] };
  const { clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    streetAddress: "",
    townCity: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.streetAddress) newErrors.streetAddress = "Street Address is required";
    if (!formData.townCity) newErrors.townCity = "Town/City is required";

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// In handleStripePayment function
const handleStripePayment = async (orderData) => {
  if (!stripe || !elements) {
    toast.error("Payment system not ready. Please try again.");
    return false;
  }

  setIsProcessingPayment(true);
  setPaymentError(null);

  try {
    const { clientSecret } = await createPaymentIntent({
      amount: Math.round(orderData.totalPrice * 100),
      currency: "inr",
    });

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement("card"),
        billing_details: {
          name: orderData.firstName,
          email: orderData.email,
          phone: orderData.phoneNumber,
          address: {
            line1: orderData.streetAddress,
            city: orderData.townCity,
            country: "IN",
          },
        },
      },
      // Add this to handle redirects if needed
      return_url: window.location.origin + '/order-complete',
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setPaymentError(error.message);
      } else {
        setPaymentError('An unexpected error occurred.');
      }
      throw error;
    }

    if (paymentIntent.status === 'succeeded') {
      return paymentIntent.id;
    }
  } catch (error) {
    console.error("Stripe Error:", error);
    toast.error(error.message || "Payment failed");
    return false;
  } finally {
    setIsProcessingPayment(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warn("Please correct form errors");
      return;
    }

    setIsLoading(true);
    const orderData = {
      ...formData,
      cart,
      totalPrice: cart.reduce((total, item) => total + item.price * item.qty, 0),
      paymentMethod,
    };

    try {
      let stripePaymentId = null;
      if (paymentMethod === "card") {
        stripePaymentId = await handleStripePayment(orderData);
        if (!stripePaymentId) return;
      }

      await placeOrder({
        ...orderData,
        ...(stripePaymentId && { stripePaymentId }),
      });

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <UserLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">Billing Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, " $1").trim()} <span className="text-red-600">*</span>
                    </label>
                    <input
                      type={key === "email" ? "email" : "text"}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="mt-1 block w-full border p-2 rounded-lg bg-gray-100 border-gray-300"
                    />
                    {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span>Online Payment (Card)</span>
                </label>
              </div>

              {paymentMethod === "card" && (
                <>
                  <StripePaymentForm setPaymentError={setPaymentError} />
                  {paymentError && <p className="text-red-500 text-sm mt-2">{paymentError}</p>}
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between mb-3">
                <div>{item.name} x {item.qty}</div>
                <div>₹{item.price * item.qty}</div>
              </div>
            ))}
            <div className="border-t pt-3 mt-4 flex justify-between font-bold">
              <span>Total:</span>
              <span>₹{getTotalPrice()}</span>
            </div>
            <button
              type="submit"
              disabled={isLoading || isProcessingPayment || (paymentMethod === "card" && (!stripe || !elements))}
              className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessingPayment ? "Processing Payment..." : isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  );
}

export default BillingPageContent;
