import React, { useState } from "react";
import { loginUser } from "../apis/AuthApi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { FaEnvelope, FaLock, FaTimes } from "react-icons/fa";

const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const {
    showLoginModal,
    setShowLoginModal,
    setShowRegisterModal,
    setShowForgetPasswordModal,
  } = useModal();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      login(response.token, response.user);
      // toast.success("Login successful!");
      setShowLoginModal(false);
    } catch (error) {
      // toast.error(error.response?.data?.message || "Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg flex w-[90%] max-w-3xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
        >
          <FaTimes />
        </button>

        {/* Left Side - Login Form */}
        <div className="w-1/2 bg-white p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Hello!
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in to your account
          </p>

          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <button
              onClick={() => {
                setShowLoginModal(false);
                setShowForgetPasswordModal(true);
              }}
              className="text-indigo-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Logging in..." : "SIGN IN"}
          </button>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <button
              onClick={() => {
                setShowLoginModal(false);
                setShowRegisterModal(true);
              }}
              className="text-indigo-600 font-medium hover:underline"
            >
              Create
            </button>
          </p>
        </div>

        {/* Right Side - Welcome Section */}
        <div className="w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-8 flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-sm mt-2 opacity-80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae mauris volutpat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
