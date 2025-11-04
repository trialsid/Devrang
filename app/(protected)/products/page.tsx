"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Product } from "../../../types";
import { useAppContext } from "../../../context/AppContext";

const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}> = ({ product, onAddToCart }) => {
  return (
    <div className="card flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover bg-[#f3eaff]"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-subtitle">
          {product.type} — {product.size}
        </p>
        <p className="product-description flex-grow">{product.use}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(product, 1)}
            className="btn-primary px-4 py-2 rounded-md text-sm hover:scale-105 active:scale-95 transition-transform"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const { addToCart } = useAppContext();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products/get");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error("❌ Error loading products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productTypes = useMemo(() => {
    if (!products.length) return ["All"];
    return ["All", ...Array.from(new Set(products.map((p) => p.type)))];
  }, [products]);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.use?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || product.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
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
  }, [products, searchTerm, filterType, sortOrder]);

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

      {/* Search and filters */}
      <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl border border-violet-100 shadow-md mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name or use..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-violet-200 rounded-md focus:ring-violet-400 focus:border-violet-400 placeholder-violet-400 text-violet-800"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border border-violet-200 rounded-md text-violet-700 focus:ring-violet-400 focus:border-violet-400"
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
          className="p-2 border border-violet-200 rounded-md text-violet-700 focus:ring-violet-400 focus:border-violet-400"
        >
          <option value="name-asc">Sort by Name (A–Z)</option>
          <option value="name-desc">Sort by Name (Z–A)</option>
          <option value="price-asc">Sort by Price (Low–High)</option>
          <option value="price-desc">Sort by Price (High–Low)</option>
        </select>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-violet-600">
          Loading products...
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-10">{error}</div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center text-violet-700 py-10">
          No products match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id?.toString() || product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
