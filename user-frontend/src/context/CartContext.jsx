import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // 🛒 Local Storage से Cart Load करें (अगर पहले से कुछ Store है)
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 🚀 Cart Update होने पर Local Storage में Save करें
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Cart में Item Add करें
// In CartContext.jsx
const addToCart = (product) => { // Remove isAuthenticated parameter
  setCart((prevCart) => {
    const existingItem = prevCart.find((item) => item._id === product._id);
    if (existingItem) {
      return prevCart.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      );
    }
    return [...prevCart, { ...product, qty: 1 }];
  });
  return true;
};

  // 🔄 Quantity Update करने का Function (Frontend में ही Handle होगा)
  const updateCartQuantity = (productId, action) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === productId) {
          return {
            ...item,
            qty: action === "increase" ? item.qty + 1 : Math.max(item.qty - 1, 1),
          };
        }
        return item;
      })
    );
  };

  // ❌ Cart से Item Remove करें (Frontend में ही Handle होगा)
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity,clearCart,getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
