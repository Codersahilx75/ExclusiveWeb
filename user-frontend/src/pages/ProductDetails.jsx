// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductDetails } from "../components/apis/ProductApi";

function ProductDetails() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductDetails(id);
        if (response.success) {
          setProduct(response.product);
        } else {
          setError("Product not found");
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <img
        src={`${import.meta.env.VITE_API_HOST}/${product.img}`}
        alt={product.name}
        className="w-full h-64 object-cover rounded-md"
      />
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p className="text-lg text-red-500 font-bold">₹{product.price}</p>
        <p className="mt-2 text-gray-700">{product.description}</p>
        
        {/* Additional product details */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Category</h3>
            <p className="text-gray-600 capitalize">{product.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;