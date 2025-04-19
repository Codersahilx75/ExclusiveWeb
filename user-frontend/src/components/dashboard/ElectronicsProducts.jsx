import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ElectronicsProducts({ products }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { category } = useParams();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (category === "electronics") return;

    const updateScrollButtons = () => {
      if (scrollRef.current) {
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
        setCanScrollRight(
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth < scrollRef.current.scrollWidth
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
  }, [category]);

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

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="relative mb-6">
      <h3 className="text-xl font-semibold mb-3">📱 Electronics</h3>

      {category !== "electronics" && canScrollLeft && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-700 hover:text-black z-10 flex"
          onClick={scrollLeft}
        >
          <FaChevronLeft />
        </button>
      )}

      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className={`scrollbar-hide ${
            category === "electronics"
              ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex space-x-4 overflow-x-auto"
          }`}
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .product-img {
              transition: transform 0.4s ease-in-out;
            }
            .product-img:hover {
              transform: scale(1.1);
            }
          `}</style>

          {products.map((product) => (
            <div
              key={product._id}
              className={`flex-shrink-0 border border-purple-600 p-3 rounded-md text-center 
                transition-transform duration-300 transform hover:scale-95 hover:shadow-xl ${
                  category === "electronics"
                    ? "w-full h-auto"
                    : "w-[48%] sm:w-[48%] md:w-[18%] lg:w-[15%]"
                }`}
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="w-full h-44 md:h-48 lg:h-52">
                <img
                  src={`${import.meta.env.VITE_API_HOST}/${product.img}`}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-md cursor-pointer product-img"
                  onClick={() => navigate(`/product/${product.productId}`)}
                />
              </div>
              <p className="text-lg text-purple-800 font-semibold mt-2">{product.name}</p>
              <p className="text-sm text-purple-800 font-bold">₹{product.price}</p>
              <button
                className="mt-2 w-full border border-purple-600 text-purple-800 text-sm font-semibold px-3 py-2 rounded-md hover:bg-purple-500 hover:text-white transition"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
              
            </div>
          ))}
        </div>
      </div>

      {category !== "electronics" && canScrollRight && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-700 hover:text-black z-10 flex"
          onClick={scrollRight}
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
}

export default ElectronicsProducts;
