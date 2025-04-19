import API from "../../config/axiosInstance";
import { toast } from "react-toastify";

// User Registration API
export const registerUser = async (userData) => {
  try {
    const res = await API.post("/auth/register", userData);
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed");
    throw error;
  }
};

// OTP Verification API
export const verifyOTP = async (otpData) => {
  try {
    const res = await API.post("/auth/verify-otp", otpData);
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "OTP verification failed");
    throw error;
  }
};

// User Login API
export const loginUser = async (loginData) => {
  try {
    const res = await API.post("/auth/login", loginData);
    localStorage.setItem("token", res.data.token);
    toast.success("Login Successful!");
    return res.data;
  } catch (error) {   
    toast.error(error.response?.data?.message || "Login failed");
    throw error;
  }
};

// Send Forgot Password OTP API
export const sendForgotPasswordOtp = async (email) => {
  try {
    const res = await API.post("/auth/send-forgot-otp", { email });
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error sending OTP");
    throw error;
  }
};

// Verify OTP and Reset Password API
export const verifyForgotPasswordOtp = async ({ email, otp, newPassword }) => {
  try {
    const res = await API.post("/auth/verify-forgot-otp", {
      email,
      otp,
      newPassword,
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to reset password");
    throw error;
  }
};
