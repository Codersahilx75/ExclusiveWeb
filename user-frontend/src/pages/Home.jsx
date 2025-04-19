import React from "react";
import { useParams } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import HomeSlider from "../components/dashboard/HomeSlider";
import UserProducts from "../components/dashboard/UserProducts";
import Card from "../components/dashboard/Card";

function Home() {
  const { category } = useParams(); // ✅ Get category from URL

  return (
    <UserLayout>
      {/* ✅ Show HomeSlider only when there is no category */}
      {!category && <HomeSlider />}

      {/* ✅ Show Category-wise Products */}
      <UserProducts category={category} />

      <Card />

      


    </UserLayout>
  );
}

export default Home;
