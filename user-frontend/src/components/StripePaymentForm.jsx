import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { createPaymentIntent } from './apis/ProductApi'; // ✅ import from ProductApi

const StripePaymentForm = ({ formData, cart, totalPrice, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      const paymentData = {
        cart,
        totalPrice,
      };

      const data = await createPaymentIntent(paymentData); // ✅ use extracted API

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onSuccess(result.paymentIntent.id); // Call parent on success
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed.");
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <CardElement className="p-4 border border-gray-300 rounded" />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
        Pay ₹{totalPrice}
      </button>
    </form>
  );
};

export default StripePaymentForm;
