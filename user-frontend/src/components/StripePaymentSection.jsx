// src/components/StripePaymentSection.jsx
import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

const StripePaymentSection = ({ processing }) => (
  <div className="border p-4 rounded-lg">
    <CardElement
      options={{
        style: {
          base: {
            fontSize: "16px",
            color: "#424770",
            "::placeholder": { color: "#aab7c4" },
          },
          invalid: { color: "#9e2146" },
        },
      }}
    />
    {processing && <p className="mt-2 text-sm text-gray-500">Processing payment...</p>}
  </div>
);

export default StripePaymentSection;
