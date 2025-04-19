import API from "../../config/axiosInstance";

// Admin Register
export const adminRegister = async (formData) => {
  try {
    const response = await API.post("/admin/register", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

// Verify OTP
export const verifyAdminOtp = async ({ email, otp }) => {
  try {
    const response = await API.post("/admin/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "OTP verification failed";
  }
};

// Admin Login
export const adminLogin = async (loginData) => {
  try {
    const response = await API.post("/admin/login", loginData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};
