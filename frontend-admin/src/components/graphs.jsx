import React, { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const weeklyData = [
  { day: "Mon", pageViews: 30, sessions: 15, income: 1200 },
  { day: "Tue", pageViews: 40, sessions: 30, income: 1500 },
  { day: "Wed", pageViews: 25, sessions: 35, income: 1100 },
  { day: "Thu", pageViews: 50, sessions: 20, income: 900 },
  { day: "Fri", pageViews: 80, sessions: 40, income: 1300 },
  { day: "Sat", pageViews: 120, sessions: 55, income: 1700 },
  { day: "Sun", pageViews: 100, sessions: 45, income: 1400 },
];

const monthlyData = [
  { day: "Week 1", pageViews: 200, sessions: 120, income: 5000 },
  { day: "Week 2", pageViews: 250, sessions: 150, income: 6500 },
  { day: "Week 3", pageViews: 280, sessions: 180, income: 7000 },
  { day: "Week 4", pageViews: 300, sessions: 200, income: 7500 },
];

function Graphs() {
  const [dataType, setDataType] = useState("week");

  const data = dataType === "week" ? weeklyData : monthlyData;

  return (
    <div className="mt-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Unique Visitor</h2>
        <div className="space-x-2">
          <button
            className={`px-3 py-1 border rounded-md ${dataType === "month" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => setDataType("month")}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 border rounded-md ${dataType === "week" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => setDataType("week")}
          >
            Week
          </button>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pageViews" stroke="#007bff" strokeWidth={2} fillOpacity={0.3} fill="rgba(0, 123, 255, 0.2)" />
            <Line type="monotone" dataKey="sessions" stroke="#17a2b8" strokeWidth={2} fillOpacity={0.3} fill="rgba(23, 162, 184, 0.2)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <h2 className="text-xl font-semibold mt-6">Income Overview</h2>
      <div className="  mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="income" fill="#12a6" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Graphs;
