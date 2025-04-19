// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ Required for styling
import LoginModal from "./components/dashboard/LoginModal";
import RegisterModal from "./components/dashboard/RegisterModal";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import ProductDetails from "./pages/ProductDetails";
import BillingPage from "./pages/BillingPage";
import Profile from "./pages/Profile";
import "./App.css";
import ForgetPasswordModal from "./components/dashboard/ForgetPasswordModal";
import CheckoutSuccess from "./pages/CheckoutSuccess";


function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          {/* ✅ ToastContainer placed outside Routes but inside Router */}
          <ToastContainer position="top-right" autoClose={3000} />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/success" element={<CheckoutSuccess />} />

          </Routes>

          {/* Global Modals */}
          <LoginModal />
          <RegisterModal />
          <ForgetPasswordModal/>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
