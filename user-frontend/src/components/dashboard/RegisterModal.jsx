import React, { useState } from "react";
import { registerUser, verifyOTP, loginUser } from "../apis/AuthApi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { FaUser, FaMobile, FaEnvelope, FaLock, FaKey } from "react-icons/fa";

const RegisterModal = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { showRegisterModal, setShowRegisterModal, setShowLoginModal } = useModal();

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await registerUser({ name, mobile, email, password });
      setStep(2);
      // toast.success("OTP sent to your email!");
    } catch (error) {
      // setError(error.response?.data?.message || "Registration failed");
      // toast.error(error.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    try {
      await verifyOTP({ email, otp });
      const loginResponse = await loginUser({ email, password });
      login(loginResponse.token, loginResponse.user);
      // toast.success("Registration successful! You are now logged in.");
      setShowRegisterModal(false);
    } catch (error) {
      // setError(error.response?.data?.message || "OTP verification failed");
      // toast.error(error.response?.data?.message || "OTP verification failed");
    }
    setLoading(false);
  };

  if (!showRegisterModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg flex w-[90%] max-w-3xl overflow-hidden">
        {/* Left Side - Form Section */}
        <div className="w-1/2 bg-white p-8 flex flex-col justify-center">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Create an Account</h2>
              {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

              <div className="relative mb-3">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative mb-3">
                <FaMobile className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile Number"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative mb-3">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
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

              <button
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Register"}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Verify OTP</h2>
              {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

              <div className="relative mb-4">
                <FaKey className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          <button
            className="w-full bg-gray-200 p-2 rounded mt-3 hover:bg-gray-300 transition"
            onClick={() => setShowRegisterModal(false)}
          >
            Cancel
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <button
              onClick={() => {
                setShowRegisterModal(false);
                setShowLoginModal(true);
              }}
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Right Side - Welcome Section */}
        <div className="w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-8 flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold">Join Us Today!</h2>
          <p className="text-sm mt-2 opacity-80">
            Sign up to explore a world of amazing products and seamless shopping.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
