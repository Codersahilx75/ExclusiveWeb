import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import UserLayout from '../layouts/UserLayout';
import { placeOrderAfterPayment } from '../components/apis/ProductApi';

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const completeOrder = async () => {
      try {
      const response = await placeOrderAfterPayment(sessionId);
  
        if (response.message) {
          toast.success("Order placed successfully!");
          clearCart();
          navigate("/profile");
        }
      } catch (error) {
        console.error("Order completion error:", error);
        toast.error("Failed to complete order. Please check your order history.");
        navigate("/billing");
      }
    };
  
    completeOrder();
  }, [sessionId, navigate, clearCart]);
  return (
    <UserLayout>
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
        <p className="text-lg">Your order is being processed...</p>
      </div>
    </UserLayout>
  );
}

export default SuccessPage;