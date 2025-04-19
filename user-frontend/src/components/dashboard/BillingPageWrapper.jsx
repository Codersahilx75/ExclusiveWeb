import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BillingPage from "../pages/BillingPage";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BillingPageWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <BillingPage />
    </Elements>
  );
};

export default BillingPageWrapper;
