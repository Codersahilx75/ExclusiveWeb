import React from "react";
import { FiMenu, FiMail } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";

export default function AdminHeader({ toggleSidebar }) {
  return (
    <header className="bg-white  border-b border-gray-200 p-4 flex items-center justify-between w-full">
      {/* Sidebar Toggle Button - Always visible */}
      <button className="lg:hidden p-2 rounded" onClick={toggleSidebar}>
        <FiMenu size={24} />
      </button>

      {/* Rest of the header code remains the same */}
      <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 w-1/3">
        <FaSearch className="text-gray-500 mr-2" size={14} />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none w-full text-gray-700"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-200 transition-all">
          <FiMail size={20} className="text-gray-600" />
        </button>

        <div className="flex items-center space-x-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-gray-800 font-medium cursor-pointer">
            admin
          </span>
        </div>
      </div>
    </header>
  );
}
