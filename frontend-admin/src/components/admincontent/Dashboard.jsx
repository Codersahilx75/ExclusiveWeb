import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Graphs from "../graphs";
import Recent from "../Recent";
import SalesReoprt from "../SalesReport ";
import { getVerifiedUserCount, getTotalOrderCount } from "../../components/apis/ProductApi";

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const verifiedUserCount = await getVerifiedUserCount(); 
      const totalOrderCount = await getTotalOrderCount(); // 🔥

    const generatedStats = [
      {
        title: "Total Page Views",
        value: getRandomNumber(300000, 500000).toLocaleString(),
        change: `${getRandomNumber(50, 70)}%`,
        extra: getRandomNumber(20000, 50000).toLocaleString(),
        color: "text-blue-500 bg-blue-100",
        icon: <FaArrowUp />,
        hoverEffect: "hover:scale-105 hover:bg-blue-100",
      },
      {
        title: "Total Users",
        value: verifiedUserCount.toLocaleString(), // Set total users to the verified count
        change: `${getRandomNumber(60, 80)}%`,
        extra: getRandomNumber(5000, 10000).toLocaleString(),
        color: "text-green-500 bg-green-100",
        icon: <FaArrowUp />,
        hoverEffect: "hover:scale-105 hover:bg-green-100",
      },
      {
        title: "Total Order",
        value: totalOrderCount.toLocaleString(), // ✅ REAL ORDER COUNT
        change: `${getRandomNumber(20, 40)}%`,
        extra: getRandomNumber(1000, 3000).toLocaleString(),
        color: "text-yellow-500 bg-yellow-100",
        icon: <FaArrowDown />,
        hoverEffect: "hover:scale-105 hover:bg-yellow-100",
      },
      {
        title: "Total Sales",
        value: `$${getRandomNumber(20000, 50000).toLocaleString()}`,
        change: `${getRandomNumber(20, 40)}%`,
        extra: `$${getRandomNumber(10000, 30000).toLocaleString()}`,
        color: "text-red-500 bg-red-100",
        icon: <FaArrowDown />,
        hoverEffect: "hover:scale-105 hover:bg-red-100",
      },
    ];
    setStats(generatedStats);
  };
  fetchStats();
}, []); 

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white p-6 border border-gray-300 rounded-md transform transition-all duration-300 ${stat.hoverEffect}`}
          >
            <h3 className="text-gray-600 text-lg font-medium">{stat.title}</h3>
            <div className="flex items-center justify-between mt-3">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold ${stat.color}`}
              >
                {stat.icon} {stat.change}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              You made an extra{" "}
              <span className="font-semibold text-blue-600">{stat.extra}</span> this year
            </p>
          </div>
        ))}
      </div>

      <Graphs />

      <Recent />

      <SalesReoprt />
    </div>
  );
}

export default Dashboard;
