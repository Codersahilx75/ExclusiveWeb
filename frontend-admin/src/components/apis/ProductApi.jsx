import API from "../../config/axiosInstance";
import { toast } from "react-toastify";

// Product APIs
export const ProductApi = async () => {
  try {
    const { data } = await API.get(`${import.meta.env.VITE_API_URL}/products/all`);
    return data;
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

export const AddProduct = async (data) => {
  try {
    const res = await API.post(`${import.meta.env.VITE_API_URL}/products/add`, data);
    if (res) {
      toast.success(res.data.message);
      return res;
    }
  } catch (error) {
    console.error("Error adding product", error);
    toast.error(error.response.data.message);
  }
};

export const UpdateProduct = async (Id, data) => {
  try {
    const res = await API.put(`${import.meta.env.VITE_API_URL}/products/update/${Id}`, data);
    if (res) {
      toast.success(res.data.message);
      return res;
    }
  } catch (error) {
    console.error("Error updating product", error);
    toast.error(error.response.data.message);
  }
};

export const DeleteProduct = async (id) => {
  try {
    const res = await API.delete(`${import.meta.env.VITE_API_URL}/products/delete/${id}`);
    if (res) {
      toast.success(res.data.message);
      return res;
    }
  } catch (error) {
    console.error("Error deleting product", error);
    toast.error(error.response.data.message);
  }
};

// Order APIs
export const getAllOrders = async () => {
  try {
    const response = await API.get("/orders/allorders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}; 



export const getRecentOrders = async () => {
  try {
    const response = await API.get("/orders/recent");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};


export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await API.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};



export const getVerifiedUserCount = async () => {
  try {
    const { data } = await API.get(`${import.meta.env.VITE_API_URL}/auth/verified-user-count`);
    return data.count;
  } catch (error) {
    console.error("Error fetching verified user count", error);
    return 0;
  }
};


export const getTotalOrderCount = async () => {
  try {
    const res = await API.get("/orders/total-count");
    return res.data.totalOrders || 0;
  } catch (err) {
    console.error("❌ Failed to fetch total order count", err);
    return 0;
  }
}; 



export const getOrderById = async (orderId) => {
  try {
    const response = await API.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
}; 



export const getAllUsers = async () => {
  try {
    const { data } = await API.get(`${import.meta.env.VITE_API_URL}/auth/all-users`);
    return data;
  } catch (error) {
    console.error("Error fetching users", error);
    toast.error("Failed to fetch users");
    return [];
  }
}

