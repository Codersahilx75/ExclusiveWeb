import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("🎉 Payment successful! Order placed.");
    localStorage.removeItem("cart");
    navigate("/");
  }, []);

  return (
    <div className="p-10 text-center text-green-600 font-semibold text-xl">
      Redirecting... Your order is confirmed.
    </div>
  );
}

export default PaymentSuccess;
