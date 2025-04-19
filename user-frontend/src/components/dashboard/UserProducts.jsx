import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";  // ✅ Added
import API from "../../config/axiosInstance";
import FoodProducts from "./FoodProducts";
import ClothesProducts from "./ClothesProducts";
import ElectronicsProducts from "./ElectronicsProducts";
import CoffeeProducts from "./CoffeeProducts";
import NewStockProducts from "./NewStockProducts";

function UserProducts() {
  const { category } = useParams();  // ✅ Get category from URL
  const [categories, setCategories] = useState({
    food: [],
    electronics: [],
    clothing: [],
    coffee: [],
    newstock: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/all");

        if (res.data && Array.isArray(res.data.products)) {
          const categorizedData = {
            food: res.data.products.filter((p) => p.category.toLowerCase() === "food"),
            electronics: res.data.products.filter((p) => p.category.toLowerCase() === "electronics"),
            clothing: res.data.products.filter((p) => p.category.toLowerCase() === "clothing"),
            coffee: res.data.products.filter((p) => p.category.toLowerCase() === "coffee"),
            newstock: res.data.products.filter((p) => p.category.toLowerCase() === "newstock"),
          };

          setCategories(categorizedData);
        } else {
          console.error("Invalid API response:", res.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-2xl font-bold mb-5 ">
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} All Products` : "All Products"}
      </h2>

      {/* ✅ Only show selected category */}
      {(!category || category === "food") && categories.food.length > 0 && <FoodProducts products={categories.food} />}
      {(!category || category === "electronics") && categories.electronics.length > 0 && <ElectronicsProducts products={categories.electronics} />}
      {(!category || category === "clothing") && categories.clothing.length > 0 && <ClothesProducts products={categories.clothing} />}
      {(!category || category === "coffee") && categories.coffee.length > 0 && <CoffeeProducts products={categories.coffee} />}
      {(!category || category === "newstock") && categories.newstock.length > 0 && <NewStockProducts products={categories.newstock} />}
    </div>
  );
}

export default UserProducts;
