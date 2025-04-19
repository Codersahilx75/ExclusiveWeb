import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ensure this is defined in your .env file
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Add a request interceptor (optional)
API.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor (optional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default API;
