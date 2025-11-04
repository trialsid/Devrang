"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { BookingStatus } from "../../../types";

const BookingDetailsModal: React.FC<{
  booking: any;
  onClose: () => void;
}> = ({ booking, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-text-main mb-4">
        Order Details (ID: {booking.order_id})
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <strong>Customer:</strong> {booking.customer?.name}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          <span className="font-semibold capitalize">{booking.status}</span>
        </div>
        <div>
          <strong>Date:</strong>{" "}
          {new Date(booking.createdAt).toLocaleDateString()}
        </div>
        <div>
          <strong>Total:</strong>{" "}
          <span className="font-bold text-lg text-primary">
            ₹{booking.amount.toFixed(2)}
          </span>
        </div>
      </div>

      <h3 className="font-semibold mb-2">Product:</h3>
      <ul className="border-t border-b divide-y mb-4">
        <li className="flex justify-between py-2">
          <span>{booking.product?.name}</span>
          <span>₹{booking.product?.price.toFixed(2)}</span>
        </li>
      </ul>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const BookingsPage: React.FC = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) fetchOrders(session.user.email);
  }, [session]);

  const filteredOrders = useMemo(() => {
    if (filterStatus === "All") return orders;
    return orders.filter((o) => o.status === filterStatus);
  }, [orders, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "captured":
        return "bg-green-100 text-green-800";
      case "created":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {selectedOrder && (
        <BookingDetailsModal
          booking={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      <h1 className="text-3xl font-bold text-text-main mb-6">My Orders</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-4">
          <span>Filter by status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            <option value="created">Created</option>
            <option value="paid">Paid</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-secondary">
              <tr className="text-left text-primary">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.order_id}
                  </td>
                  <td className="px-6 py-4">{order.customer?.name}</td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ₹{order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <p className="text-center p-6 text-gray-500">
              No orders found for this filter.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
