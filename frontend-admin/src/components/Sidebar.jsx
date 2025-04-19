import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaCog } from "react-icons/fa";

const navItems = [
  { to: "/", label: "Dashboard", icon: <FaTachometerAlt size={16} /> },
  { to: "/products", label: "Products", icon: <FaBoxOpen size={16} /> },
  { to: "/orders", label: "Orders", icon: <FaShoppingCart size={16} /> },
  { to: "/users", label: "Users", icon: <FaUsers size={16} /> },
  { to: "/settings", label: "Settings", icon: <FaCog size={16} /> },
];

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside
      className={`bg-white border-r border-gray-200 w-64 h-screen p-4 fixed top-0 left-0 transition-transform lg:relative lg:translate-x-0 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <button className="lg:hidden text-black text-lg" onClick={toggleSidebar}>
          ✖
        </button>
      </div>
      <ul className="space-y-3">
        {navItems.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded cursor-pointer group ${
                  isActive
                    ? "bg-blue-200 text-blue-800"
                    : "hover:bg-blue-300 hover:text-blue-800"
                }`
              }
            >
              {icon}
              <span className="inline-block transition-all duration-200 ease-in-out group-hover:ml-2">
                {label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
