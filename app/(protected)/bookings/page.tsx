"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Booking, BookingStatus } from "../../../types";
const BookingDetailsModal: React.FC<{
  booking: Booking;
  onClose: () => void;
}> = ({ booking, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-text-main mb-4">
        Booking Details (ID: {booking.id})
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <strong>Customer:</strong>{" "}
          {booking.customer === "self" ? "Self-booking" : booking.customer.name}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          <span className="font-semibold">{booking.status}</span>
        </div>
        <div>
          <strong>Date:</strong> {booking.createdAt.toLocaleDateString()}
        </div>
        <div>
          <strong>Total:</strong>{" "}
          <span className="font-bold text-lg text-primary">
            ${booking.total.toFixed(2)}
          </span>
        </div>
      </div>
      <h3 className="font-semibold mb-2">Items:</h3>
      <ul className="border-t border-b divide-y mb-4">
        {booking.items.map((item) => (
          <li key={item.product.id} className="flex justify-between py-2">
            <span>
              {item.product.name} (x{item.quantity})
            </span>
            <span>
              ${(item.customPrice || item.product.price).toFixed(2)} each
            </span>
          </li>
        ))}
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
  const { bookings } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "All">(
    "All"
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    if (filterStatus === "All") return bookings;
    return bookings.filter((b) => b.status === filterStatus);
  }, [bookings, filterStatus]);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Paid:
        return "bg-green-100 text-green-800";
      case BookingStatus.Delivered:
        return "bg-blue-100 text-blue-800";
      case BookingStatus.PendingPayment:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
      <h1 className="text-3xl font-bold text-text-main mb-6">
        Booking History
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-4">
          <span>Filter by status:</span>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as BookingStatus | "All")
            }
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            {Object.values(BookingStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-secondary">
            <tr className="text-left text-primary">
              <th className="px-6 py-3">Booking ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.id}
                </td>
                <td className="px-6 py-4">
                  {booking.customer === "self"
                    ? "Self-booking"
                    : booking.customer.name}
                </td>
                <td className="px-6 py-4">
                  {booking.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-semibold">
                  ${booking.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && (
          <p className="text-center p-6 text-gray-500">
            No bookings found for this filter.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
