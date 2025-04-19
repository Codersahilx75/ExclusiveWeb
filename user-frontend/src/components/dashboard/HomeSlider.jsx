import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import slide1 from "../../assets/img/slide/5.jpg";
import slide2 from "../../assets/img/slide/4.jpg";
import slide3 from "../../assets/img/slide/2.jpg";
import slide4 from "../../assets/img/slide/3.jpg";
import slide5 from'../../assets/img/slide/1.jpg';
import slide6 from"../../assets/img/slide/7.jpg";
import slide7 from"../../assets/img/slide/2.jpg";
import slide8 from"../../assets/img/slide/5.jpg";
import slide9 from"../../assets/img/slide/1.jpg";
import slide10 from"../../assets/img/slide/4.jpg";

const images = [slide1, slide2, slide3, slide4,slide5,slide6,slide7,slide8,slide9,slide10];

function HomeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden ">
      {/* Image Wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out w-full"
        style={{ transform: `translateX(-${(currentIndex % images.length) * 100}%)` }}
      >
        {[...images, ...images].map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index % images.length + 1}`}
            className="w-full h-[300px] md:h-[500px] object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => setCurrentIndex((prev) => prev - 1)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => prev + 1)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
}

export default HomeSlider;