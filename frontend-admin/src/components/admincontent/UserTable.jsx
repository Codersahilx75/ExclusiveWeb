import React, { useEffect, useState } from "react";
import { getAllUsers } from "../apis/ProductApi";
import { FiSearch } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight, FaUsers } from "react-icons/fa";

const USERS_PER_PAGE = 10;

function UserTable() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchUsers() {
      const allUsers = await getAllUsers();
      setUsers(allUsers.reverse());
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterVerified === "all" ||
      (filterVerified === "verified" && user.isVerified) ||
      (filterVerified === "notVerified" && !user.isVerified);

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pageNumbers.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="px-2 py-1"
        >
          1
        </button>
      );
      if (start > 2) {
        pageNumbers.push(<span key="dots-start">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-blue-50 border-blue-500 text-blue-600 border"
              : "text-blue-500 hover:bg-blue-400 hover:text-white"
          }`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pageNumbers.push(<span key="dots-end">...</span>);
      }
      pageNumbers.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="px-2 py-1"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl flex items-center space-x-2 font-bold text-indigo-600">
          📋 All Registered Users
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <select
            value={filterVerified}
            onChange={(e) => {
              setFilterVerified(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="notVerified">Not Verified</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800 text-white text-sm">
            <tr>
              <th className=" p-3">Sr. No.</th>
              <th className=" p-3">Name</th>
              <th className=" p-3">Email</th>
              <th className=" p-3">Mobile</th>
              <th className=" p-3">Verified</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedUsers.map((user, index) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{startIndex + index + 1}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.mobile}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {endIndex} of {filteredUsers.length} users
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md border ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <FaArrowLeft />
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md border ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserTable;
