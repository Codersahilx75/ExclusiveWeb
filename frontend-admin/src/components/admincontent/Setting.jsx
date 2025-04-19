import React, { useState } from "react";
import { Pencil, Save } from "lucide-react";

function Setting() {
  const [editPersonal, setEditPersonal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  const [admin, setAdmin] = useState({
    avatar:
      "https://ui-avatars.com/api/?name=Natashia+Khaleira&background=4f46e5&color=fff",
    firstName: "Natashia",
    lastName: "Khaleira",
    dob: "12-10-1990",
    email: "info@binary-fusion.com",
    phone: "(+62) 821 2554-5846",
    role: "Admin",
    country: "United Kingdom",
    city: "Leeds, East London",
    postalCode: "ERT 1254",
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  return (
    <div className=" mx-auto space-y-8  min-h-screen">
      {/* Profile Header */}
      <div className="bg-indigo-100 shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
        <div className="relative group">
          <img
            src={admin.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
          />
          <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full cursor-pointer hidden group-hover:flex items-center justify-center text-white text-xs font-semibold">
            Change
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setAdmin({ ...admin, avatar: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {admin.firstName} {admin.lastName}
          </h2>
          <p className="text-sm text-gray-600 font-medium">{admin.role}</p>
          <p className="text-sm text-gray-500">
            {admin.city}, {admin.country}
          </p>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-indigo-100 shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-indigo-700">
            👤 Personal Information
          </h3>
          <button
            onClick={() => setEditPersonal(!editPersonal)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium flex items-center gap-2 transition duration-150 ${
              editPersonal
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {editPersonal ? <Save size={16} /> : <Pencil size={16} />}
            {editPersonal ? "Save" : "Edit"}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 text-sm text-gray-700">
          {["firstName", "lastName", "dob", "email", "phone", "role"].map(
            (field) => (
              <div key={field}>
                <p className="font-medium text-gray-600 mb-1">
                  {field.replace(/([A-Z])/g, " $1")}
                </p>
                {editPersonal ? (
                  <input
                    name={field}
                    value={admin[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-800">{admin[field]}</p>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Address */}
      <div className="bg-indigo-100 shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-indigo-700">📍 Address</h3>
          <button
            onClick={() => setEditAddress(!editAddress)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium flex items-center gap-2 transition duration-150 ${
              editAddress
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {editAddress ? <Save size={16} /> : <Pencil size={16} />}
            {editAddress ? "Save" : "Edit"}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 text-sm text-gray-700">
          {["country", "city", "postalCode"].map((field) => (
            <div key={field}>
              <p className="font-medium text-gray-600 mb-1">
                {field.replace(/([A-Z])/g, " $1")}
              </p>
              {editAddress ? (
                <input
                  name={field}
                  value={admin[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              ) : (
                <p className="text-gray-800">{admin[field]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Setting;
