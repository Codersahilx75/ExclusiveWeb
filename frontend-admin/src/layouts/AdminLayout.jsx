import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Fixed Position */}
      <div className=" flex-shrink-0">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow overflow-auto">
        {/* Header */}
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content - Takes More Width & Scrolls */}
        <main className="flex-grow  p-6 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}

export default AdminLayout;
