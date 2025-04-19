import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

function NewStockProducts({ products }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product); // 👈 Add Product to Cart
    navigate("/cart"); // 👈 Redirect to Cart Page
  };

  useEffect(() => {
    const updateScrollButtons = () => {
      if (scrollRef.current) {
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
        setCanScrollRight(
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth <
            scrollRef.current.scrollWidth
        );
      }
    };

    updateScrollButtons();
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", updateScrollButtons);
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", updateScrollButtons);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative mb-6 px-4">
      <h3 className="text-xl font-semibold mb-3">🆕 New Stock</h3>

      {canScrollLeft && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full z-10 flex"
          onClick={scrollLeft}
        >
          <FaChevronLeft />
        </button>
      )}

      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex space-x-4 px-6 overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {products.map((product) => (
            <div
              key={product._id}
              className="w-[48%] sm:w-[48%] md:w-[18%] lg:w-[15%] flex-shrink-0 bg-white p-3 rounded-lg shadow-md text-center"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="w-full h-40 md:h-44 lg:h-48">
                <img
                  src={`${import.meta.env.VITE_API_HOST}/${product.img}`}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-md cursor-pointer"
                  onClick={() => navigate(`/product/${product.productId}`)} // 👈 Fix: Use productId instead of _id
                />
              </div>
              <p className="text-sm font-semibold mt-2">{product.name}</p>
              <p className="text-red-500 text-lg font-bold">₹{product.price}</p>
              <button
                className="mt-2 w-full border-2 border-pink-500 text-pink-500 text-sm font-semibold px-3 py-2 rounded-md hover:bg-pink-500 hover:text-white transition"
                onClick={() => {
                  handleAddToCart(product);
                  navigate("/cart");
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {canScrollRight && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full z-10 flex"
          onClick={scrollRight}
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
}

export default NewStockProducts;
