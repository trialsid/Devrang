"use client";

import React, { useState, useMemo } from "react";
import { MOCK_PRODUCTS } from "../../../constants";
import { Product } from "../../../types";
import { useAppContext } from "../../../context/AppContext";

const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-text-main">{product.name}</h3>
        <p className="text-sm text-gray-600">
          {product.type} - {product.size}
        </p>
        <p className="mt-2 text-xs text-gray-700 flex-grow">{product.use}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product, 1)}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const { addToCart } = useAppContext();
  const [notification, setNotification] = useState("");

  const productTypes = useMemo(
    () => ["All", ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.type)))],
    []
  );

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredAndSortedProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.use?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || product.type === filterType;
      return matchesSearch && matchesType;
    }).sort((a, b) => {
      switch (sortOrder) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [searchTerm, filterType, sortOrder]);

  return (
    <div>
      {notification && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}
      <h1 className="text-3xl font-bold text-text-main mb-6">
        Product Marketplace
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or use..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          <option value="name-asc">Sort by Name (A-Z)</option>
          <option value="name-desc">Sort by Name (Z-A)</option>
          <option value="price-asc">Sort by Price (Low-High)</option>
          <option value="price-desc">Sort by Price (High-Low)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
