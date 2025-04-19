import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function UserLayout({ children }) {
  return (
    <div>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}

export default UserLayout;
