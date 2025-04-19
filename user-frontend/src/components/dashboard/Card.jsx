import React from "react";
import AppIcon from "../../assets/img/header/place-order.svg"; // Replace with correct path
import OrderIcon from "../../assets/img/header/do-not-blink.svg"; // Replace with correct path
import DeliveryIcon from "../../assets/img/header/enjoy.svg"; // Replace with correct path

const data = [
  {
    img: AppIcon,
    title: "Open the app",
    description:
      "Choose from over 7000 products across groceries, fresh fruits & veggies, meat, pet care, beauty items & more",
    bgColor: "bg-purple-300",
    hoverColor: "hover:bg-purple-200",
  },
  {
    img: OrderIcon,
    title: "Place an order",
    description: "Add your favourite items to the cart & avail the best offers",
    bgColor: "bg-green-300",
    hoverColor: "hover:bg-green-200",
  },
  {
    img: DeliveryIcon,
    title: "Get free delivery",
    description:
      "Experience lightning-fast speed & get all your items delivered in 10 minutes",
    bgColor: "bg-yellow-300",
    hoverColor: "hover:bg-yellow-200",
  },
];

function Card() {
  return (
    <div className="py-16 px-6 md:px-12 lg:px-20">
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
        How it Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className={`group ${item.bgColor} shadow-lg rounded-2xl p-8 text-center transition-all duration-300 ease-in-out
                       ${item.hoverColor} hover:shadow-2xl hover:scale-105 hover:-translate-y-10`}
          >
            <img
              src={item.img}
              alt={item.title}
              className="mx-auto h-24 md:h-28 lg:h-32 transition-transform duration-300 ease-in-out 
                         group-hover:rotate-6 group-hover:scale-150"
            />
            <h3 className="text-xl md:text-xl font-bold mt-6">{item.title}</h3>
            <p className="text-gray-600 mt-4 text-lg md:text-sm">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
