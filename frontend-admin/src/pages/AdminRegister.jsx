import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminRegister, verifyAdminOtp } from "../components/apis/authApi";

const AdminRegister = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await adminRegister(form);
      setOtpSent(true);
      setMessage(res.message);
    } catch (err) {
      setMessage(err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyAdminOtp({ email: form.email, otp });
      setMessage(res.message);
      if (res.success) {
        navigate("/login");
      }
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Admin Register</h2>
      {!otpSent ? (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-2 border mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Verify OTP
          </button>
        </form>
      )}
      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
      {message && <p className="text-sm text-center mt-4">{message}</p>}
    </div>
  );
};

export default AdminRegister;
