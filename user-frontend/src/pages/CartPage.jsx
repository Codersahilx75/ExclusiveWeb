// src/pages/CartPage.js
import React, { useState ,useMemo} from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import { FaTrash } from "react-icons/fa";
import LoginModal from "../components/dashboard/LoginModal";
import RegisterModal from "../components/dashboard/RegisterModal";
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { toast } from "react-toastify";

function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  // const { setShowLoginModal, setShowRegisterModal } = useModal();
  const { 
    showLoginModal, 
    setShowLoginModal, 
    showRegisterModal, 
    setShowRegisterModal 
  } = useModal(); 

  const getTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  }, [cart]);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please login to proceed to checkout");
      setShowLoginModal(true);
    } else if (cart.length === 0) {
      toast.error("Your cart is empty");
    } else {
      navigate("/billing", { state: { cart } });
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
    navigate("/billing", { state: { cart } });
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
    setShowRegisterModal(false);
    navigate("/billing", { state: { cart } });
  };

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  return (
    <UserLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 sm:text-left">🛒 Your Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className=" py-10">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button 
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-white hover:text-indigo-600 hover:border hover:border-indigo-400 font-medium  transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table (md and up) */}
            <div className="hidden md:block">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white uppercase text-sm">
                      <th className="p-4">Product</th>
                      <th className="p-4 text-right">Price</th>
                      <th className="p-4 text-center">Quantity</th>
                      <th className="p-4 text-right">Subtotal</th>
                      <th className="p-4 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="p-4 flex items-center space-x-3">
                          <img
                            src={`${import.meta.env.VITE_API_HOST}/${item.img}`}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md shadow-sm"
                          />
                          <span className="text-gray-700 font-medium">{item.name}</span>
                        </td>
                        <td className="p-4 text-indigo-600 font-bold text-right">₹{item.price}</td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => updateCartQuantity(item._id, "decrease")}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                                disabled={item.qty <= 1}
                              >
                                −
                              </button>
                              <span className="px-4 font-medium w-10 text-center">{item.qty}</span>
                              <button
                                onClick={() => updateCartQuantity(item._id, "increase")}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-gray-800 text-right">₹{(item.price * item.qty).toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700 transition"
                            aria-label="Remove item"
                          >
                            <FaTrash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile List (sm and down) */}
            <div className="md:hidden space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white shadow-md rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3 flex-1">
                      <img
                        src={`${import.meta.env.VITE_API_HOST}/${item.img}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-indigo-600 font-bold">₹{item.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove item"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateCartQuantity(item._id, "decrease")}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                        disabled={item.qty <= 1}
                      >
                        −
                      </button>
                      <span className="px-4 font-medium w-10 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateCartQuantity(item._id, "increase")}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-gray-800">₹{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-6">
              <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-5 shadow-lg rounded-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3 ml-auto">
                <h3 className="text-lg font-semibold mb-3 border-b border-white/30 pb-2">Cart Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{getTotalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between border-t border-white/30 pt-2 mt-2 text-lg">
                    <span>Total:</span>
                    <span className="font-bold">₹{getTotalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="w-full bg-white text-indigo-700 font-semibold py-2 rounded-md mt-4 hover:bg-gray-100 transition"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
          onRegister={openRegisterModal}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </UserLayout>
  );
}

export default CartPage;