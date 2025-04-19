import API from "../../config/axiosInstance";
import { toast } from "react-toastify";

// ✅ Fix: Correct API call for setProducts
export const setProducts = async (data) => {
  try {
    const res = await API.post("/products/all", data);
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    console.error("Error fetching products", error);
    toast.error(error.response?.data?.message || "Something went wrong!");
    throw error;
  }
};


export const placeCODOrder = async (orderData) => {
  const response = await API.post("/orders/cod", {
    ...orderData,
    paymentMethod: "cod",
    paymentStatus: "pending",
  });
  return response.data;
};

// 2. Create Stripe Checkout session
export const createStripeCheckoutSession = async (orderData) => {
  try {
    const payload = {
      cart: orderData.cart.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        img: item.img || "https://via.placeholder.com/150" // Fallback image if img is missing
      })),
      email: orderData.email
    };

    const response = await API.post(
      "/orders/create-checkout-session",
      payload,
      {
        timeout: 10000 // 10 second timeout
      }
    );

    if (response.data?.url) {
      // Save the order data in localStorage before redirecting
      localStorage.setItem("pendingOnlineOrder", JSON.stringify(orderData));
      return response.data;
    } else {
      throw new Error('No redirect URL received from payment gateway');
    }
  } catch (error) {
    console.error('Payment Error:', {
      error: error.response?.data || error.message,
      orderData: {
        ...orderData,
        cart: orderData.cart.map(i => i.name) // Log just names
      }
    });
    throw error;
  }
};
// 3. Place order after Stripe payment
export const placeOrderAfterPayment = async (sessionId) => {
  try {
    const pendingOrder = JSON.parse(localStorage.getItem("pendingOnlineOrder"));

    if (!pendingOrder || !pendingOrder.cart) {
      throw new Error("Pending order data is missing or invalid");
    }

    // Ensure `img` field is valid
    const cartWithImages = pendingOrder.cart.map(item => ({
      ...item,
      img: item.img || "https://via.placeholder.com/150" // Fallback image if img is missing
    }));

    const response = await API.post("/orders/place-order-after-payment", {
      sessionId,
      ...pendingOrder,
      cart: cartWithImages
    });

    return response.data;
  } catch (error) {
    console.error("Error placing order after payment:", error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) throw new Error("User email not found");
    
    const response = await API.get(`/orders/user/${user.email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};




// In user-frontend/src/components/apis/ProductApi.js
export const cancelOrder = async (orderId) => {
  try {
    const response = await API.put(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};


export const getProductDetails = async (productId) => {
  try {
    const response = await API.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    toast.error(error.response?.data?.message || "Failed to fetch product details");
    throw error;
  }
};




