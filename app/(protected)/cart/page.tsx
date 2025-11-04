"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Customer, CartItem, BookingStatus } from "../../../types";
import { TrashIcon } from "../../../components/Icons";
import { useRouter } from "next/navigation";

const CartPage: React.FC = () => {
  const { cart, updateCartItem, removeFromCart, customers, clearCart } =
    useAppContext();
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | "self" | null
  >(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBooking, setLastBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + (item.customPrice || item.product.price) * item.quantity,
      0
    );
  }, [cart]);

  const handlePriceOverride = (productId: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      updateCartItem(
        productId,
        item.quantity,
        isNaN(price) ? undefined : price
      );
    }
  };

  // ✅ Updated: Create Razorpay order
  const handlePlaceBooking = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer or 'Self-booking' first.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      // Currently supports single-product checkout for simplicity
      const product = cart[0].product;

      // Convert internal customer/self structure into plain data
      const customer =
        selectedCustomer === "self"
          ? {
              name: "Self Booking",
              email: "self@astrogems.com",
              phone: "N/A",
              address: "N/A",
            }
          : {
              name: selectedCustomer.name,
              email: selectedCustomer.email || "noemail@astrogems.com",
              phone: selectedCustomer.phone,
              address: selectedCustomer.shippingAddress || "Not provided",
            };

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, customer }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const data = await response.json();

      // ✅ Show confirmation page
      setLastBooking({
        id: data.id,
        paymentLink: `https://dashboard.razorpay.com/app/orders/${data.id}`,
        amount: product.price,
      });
      setShowConfirmation(true);
      clearCart();
    } catch (error) {
      console.error("❌ Booking creation failed:", error);
      alert("Failed to place booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewBooking = () => {
    setShowConfirmation(false);
    setLastBooking(null);
    setSelectedCustomer(null);
    router.push("/products");
  };

  // ✅ Confirmation view
  if (showConfirmation) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Booking Created Successfully!
        </h1>
        <p className="text-text-main mb-2">
          Razorpay Order ID:{" "}
          <span className="font-mono">{lastBooking?.id}</span>
        </p>
        {lastBooking?.paymentLink && (
          <>
            <p className="text-text-main mb-4">
              A payment request has been created via Razorpay.
            </p>
            <p className="text-text-main mb-2">View Order on Razorpay:</p>
            <input
              type="text"
              readOnly
              value={lastBooking.paymentLink}
              className="w-full max-w-md p-2 border rounded-md bg-gray-100 text-center"
            />
            <button
              onClick={() =>
                navigator.clipboard.writeText(lastBooking.paymentLink || "")
              }
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Copy Link
            </button>
          </>
        )}
        <button
          onClick={handleNewBooking}
          className="mt-8 px-6 py-3 bg-primary text-white rounded-md text-lg"
        >
          Create Another Booking
        </button>
      </div>
    );
  }

  // ✅ Main cart page
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">New Booking</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Booking Items ({cart.length})
            </h2>
            {cart.length === 0 ? (
              <p>
                Your cart is empty.{" "}
                <button
                  onClick={() => router.push("/products")}
                  className="text-primary hover:underline"
                >
                  Add products
                </button>{" "}
                to create a booking.
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Price: ₹{item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartItem(
                          item.product.id as string,
                          parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                      className="w-16 p-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Override Price"
                      value={item.customPrice || ""}
                      onChange={(e) =>
                        handlePriceOverride(
                          item.product.id as string,
                          e.target.value
                        )
                      }
                      className="w-28 p-2 border rounded-md"
                      disabled={selectedCustomer === "self"}
                    />
                    <button
                      onClick={() => removeFromCart(item.product.id as string)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            <div className="mb-4">
              <label
                htmlFor="customer"
                className="block text-sm font-medium text-text-main mb-1"
              >
                Select Customer
              </label>
              <select
                id="customer"
                onChange={(e) =>
                  setSelectedCustomer(
                    e.target.value === "self"
                      ? "self"
                      : customers.find((c) => c._id === e.target.value) || null
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Select Customer --</option>
                <option value="self">Self-booking</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceBooking}
              disabled={cart.length === 0 || !selectedCustomer || loading}
              className="w-full mt-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : selectedCustomer === "self"
                ? "Pay & Confirm"
                : "Send Payment Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
