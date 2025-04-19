import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../components/apis/authApi";

const AdminLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin(form);
      localStorage.setItem("adminToken", res.token);
      setMessage("Login successful!");
      onLogin?.(); // Optional chaining
      navigate("/");
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
      <form onSubmit={handleLogin}>
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
          Login
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </p>
      {message && <p className="text-sm text-center mt-4">{message}</p>}
    </div>
  );
};

export default AdminLogin;
