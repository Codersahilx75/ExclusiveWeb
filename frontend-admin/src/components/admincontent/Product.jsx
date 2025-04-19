import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  AddProduct,
  DeleteProduct,
  ProductApi,
  UpdateProduct,
} from "../apis/ProductApi";

function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    img: null,
    category: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ProductApi();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data?.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("category", formData.category);
    if (formData.img) form.append("img", formData.img);

    try {
      if (editingProduct) {
        await UpdateProduct(editingProduct.productId, form);
      } else {
        await AddProduct(form);
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: "", price: "", img: null, category: "" });
      setPreviewImage(null);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      img: null,
      category: product.category,
    });
    setPreviewImage(`${import.meta.env.VITE_API_HOST}/${product.img}`);
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await DeleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, img: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.price.toString().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const generatePagination = () => {
    const pages = [];
    const maxVisiblePages = 2;

    pages.push(1);

    if (currentPage > maxVisiblePages + 1) {
      pages.push("...");
    }

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= maxVisiblePages) {
      endPage = Math.min(maxVisiblePages + 1, totalPages - 1);
    } else if (currentPage >= totalPages - maxVisiblePages) {
      startPage = Math.max(totalPages - maxVisiblePages, 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - maxVisiblePages) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="w-full mx-auto  min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {showForm
            ? editingProduct
              ? "✏️  Update Product"
              : "➕ Add New Product"
            : "🛒 Product Management"}
        </h2>

        {!showForm && (
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative flex-grow max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, category, or price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingProduct(null);
                setFormData({ name: "", price: "", img: null, category: "" });
                setPreviewImage(null);
              }}
              className="flex items-center justify-center bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 transition-colors whitespace-nowrap"
            >
              <FaPlus className="mr-2" />
              Add Product
            </button>
          </div>
        )}
      </div>

      {showForm ? (
        <div className="bg-white border p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name*
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="coffee">Coffee</option>
                <option value="food">Food</option>
                <option value="newstock">New Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price*
              </label>
              <input
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
              />
              {previewImage && (
                <div className="mt-3">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-24 rounded border object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setPreviewImage(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-900 text-white transition-colors"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="bg-white overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Sr.no
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                        colSpan="6"
                      >
                        {searchTerm
                          ? "No matching products found"
                          : "No products available"}
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((product, index) => (
                      <tr key={product.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {firstIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={`${import.meta.env.VITE_API_HOST}/${
                              product?.img
                            }`}
                            alt={product?.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${parseFloat(product.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(product.productId)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white  shadow-sm gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{firstIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(lastIndex, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredProducts.length}</span>{" "}
                results
              </div>

              <nav className="flex items-center space-x-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`p-2 rounded-md border ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <FaArrowLeft />
                </button>

                {generatePagination().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-1">...</span>
                    ) : (
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? "bg-blue-50 border-blue-500 text-blue-600 border"
                            : "text-blue-500 hover:bg-blue-400 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`p-2 rounded-md border ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <FaArrowRight />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminProduct;
