import React from "react";
import { Bar } from "react-chartjs-2";
import { FaGift, FaComment, FaCog } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Sample data for the bar chart
const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Net Profit",
      data: [170, 90, 150, 120, 130, 140],
      backgroundColor: "#fbbf24",
      borderRadius: 5,
    },
    {
      label: "Revenue",
      data: [120, 50, 80, 150, 170, 100],
      backgroundColor: "#3b82f6",
      borderRadius: 5,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

// Sample transaction history data
const transactions = [
  {
    id: "#002434",
    amount: "+ $1,430",
    time: "Today, 2:00 AM",
    percentage: "78%",
    icon: <FaGift className="text-green-500" />,
    bg: "bg-green-100",
  },
  {
    id: "#984947",
    amount: "- $302",
    time: "5 August, 1:45 PM",
    percentage: "8%",
    icon: <FaComment className="text-blue-500" />,
    bg: "bg-blue-100",
  },
  {
    id: "#988784",
    amount: "- $682",
    time: "7 hours ago",
    percentage: "16%",
    icon: <FaCog className="text-red-500" />,
    bg: "bg-red-100",
  },
];

const SalesReport = () => {
  return (
    <div className="mt-10">
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Report Section */}
        <div className="md:col-span-2 bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Sales Report</h2>
          <p className="text-gray-500 text-sm mt-1">This Week Statistics</p>
          <h3 className="text-3xl font-bold mt-2">$7,650</h3>
          <div className="mt-4">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Transaction History</h2>
          <div className="mt-4 space-y-4">
            {transactions.map((txn, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${txn.bg}`}>
                  {txn.icon}
                </div>
                <div className="flex-1 ml-4">
                  <h4 className="font-semibold text-gray-700">{txn.id}</h4>
                  <p className="text-gray-500 text-sm">{txn.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{txn.amount}</p>
                  <p className="text-gray-500 text-sm">{txn.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
