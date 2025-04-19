import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../components/admincontent/Dashboard";
import Product from "../components/admincontent/Product";
import AllOrdersPage from "../components/admincontent/AllOrdersPage";
import OrderDetailsPage from "../components/admincontent/OrderDetailsPage";
import UserTable from "../components/admincontent/UserTable";
import Setting from "../components/admincontent/Setting";


function AdminHome() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Product />} />
        <Route path="/orders" element={<AllOrdersPage />} />
        <Route path="/order-details/:orderId" element={<OrderDetailsPage />} />
        <Route path="/users" element={<UserTable />} />
        <Route path="/settings" element={<Setting/>}/>
         </Routes>
    </AdminLayout>
  );
}

export default AdminHome;
