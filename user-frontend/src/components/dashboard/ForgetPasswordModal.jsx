import React, { useState } from "react";
import { toast } from "react-toastify";
import { useModal } from "../../context/ModalContext";
import { sendForgotPasswordOtp, verifyForgotPasswordOtp } from "../apis/AuthApi";
import { AiOutlineClose } from "react-icons/ai";

const ForgetPasswordModal = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const { showForgetPasswordModal, setShowForgetPasswordModal } = useModal();

  const sendOtp = async () => {
    try {
      await sendForgotPasswordOtp(email);
      setStep(2);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error("Please enter OTP");
    setStep(3);
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      await verifyForgotPasswordOtp({ email, otp, newPassword });
      toast.success("Password reset successful!");
      handleClose();
    } catch (error) {
      toast.error("Failed to reset password.");
    }
  };

  const handleClose = () => {
    setShowForgetPasswordModal(false);
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (!showForgetPasswordModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative animate-fadeIn">
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={handleClose}>
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-700 mb-5">Forgot Password</h2>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <p className="text-gray-600 text-center mb-3">Enter your email to receive an OTP</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={sendOtp}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <>
            <p className="text-gray-600 text-center mb-3">Enter the OTP sent to your email</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <p className="text-gray-600 text-center mb-3">Enter your new password</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={resetPassword}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Reset Password
            </button>
          </>
        )}

        {/* Close Button */}
        <button
          className="w-full mt-3 bg-gray-200 py-3 rounded-lg hover:bg-gray-300 transition"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ForgetPasswordModal;
