"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Customer, CartItem, BookingStatus } from "../../../types";
import { TrashIcon } from "../../../components/Icons";
import { useRouter } from "next/navigation";

const CartPage: React.FC = () => {
  const {
    cart,
    updateCartItem,
    removeFromCart,
    customers,
    addBooking,
    clearCart,
  } = useAppContext();
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | "self" | null
  >(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBooking, setLastBooking] = useState<{
    id: string;
    paymentLink?: string;
  } | null>(null);
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

  const handlePlaceBooking = () => {
    if (!selectedCustomer) {
      alert("Please select a customer or 'Self-booking' first.");
      return;
    }
    const newBooking = {
      customer: selectedCustomer,
      items: cart,
      total: cartTotal,
      status:
        selectedCustomer === "self"
          ? BookingStatus.Paid
          : BookingStatus.PendingPayment,
    };
    addBooking(newBooking);
    setLastBooking({
      id: `booking_${Date.now()}`,
      paymentLink:
        selectedCustomer !== "self"
          ? `https://pay.example.com/link_${Date.now()}`
          : undefined,
    });
    setShowConfirmation(true);
    clearCart();
  };

  const handleNewBooking = () => {
    setShowConfirmation(false);
    setLastBooking(null);
    setSelectedCustomer(null);
    router.push("/products");
  };

  if (showConfirmation) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Booking Placed Successfully!
        </h1>
        <p className="text-text-main mb-2">
          Booking ID: <span className="font-mono">{lastBooking?.id}</span>
        </p>
        {lastBooking?.paymentLink ? (
          <>
            <p className="text-text-main mb-4">
              A payment request has been sent to the customer.
            </p>
            <p className="text-text-main mb-2">Shareable Payment Link:</p>
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
        ) : (
          <p className="text-text-main mb-4">
            Your self-booking has been confirmed and marked as paid.
          </p>
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">New Booking</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        Contract Price: ${item.product.price.toFixed(2)}
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
                      : customers.find((c) => c.id === e.target.value) || null
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Select Customer --</option>
                <option value="self">Self-booking</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceBooking}
              disabled={cart.length === 0 || !selectedCustomer}
              className="w-full mt-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {selectedCustomer === "self"
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
