import React, { useState } from "react";
import axios from "axios";

function LoginSidebar({ isOpen, onClose, onLoginSuccess }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Mobile, Step 2: Enter OTP

  const sendOTP = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      alert("⚠ Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_HOST}/send-otp`, { mobile });

      if (response.data.success) {
        setStep(2);
        alert("📲 OTP has been sent. Check console for testing.");
      } else {
        alert("Failed to send OTP.");
      }
    } catch (error) {
      console.error("OTP Error:", error);
      alert("Server error! Try again later.");
    }
  };

  const verifyOTP = async () => {
    if (!/^\d{6}$/.test(otp)) {
      alert("⚠ OTP should be 6 digits.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_HOST}/verify-otp`, { mobile, otp });

      if (response.data.success) {
        alert("✅ OTP Verified! Redirecting to cart...");
        onLoginSuccess();
        onClose();
      } else {
        alert("❌ Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"} duration-300 p-4`}>
      <button onClick={onClose} className="absolute top-2 right-2 text-lg">✖</button>
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      {step === 1 ? (
        <>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2" />
          <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full p-2 border rounded mb-2" />
          <button onClick={sendOTP} className="w-full bg-blue-500 text-white p-2 rounded">Send OTP</button>
        </>
      ) : (
        <>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-2 border rounded mb-2" />
          <button onClick={verifyOTP} className="w-full bg-green-500 text-white p-2 rounded">Verify OTP</button>
        </>
      )}
    </div>
  );
}

export default LoginSidebar;
