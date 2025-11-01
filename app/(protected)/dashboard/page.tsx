"use client";

import React from "react";
import Link from "next/link";
import { useAppContext } from "../../../context/AppContext";
import { BookingStatus } from "../../../types";

const DashboardCard: React.FC<{
  title: string;
  value: string;
  description: string;
}> = ({ title, value, description }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
    <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-primary">{value}</p>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
  </div>
);

const QuickLink: React.FC<{ to: string; label: string; icon: string }> = ({
  to,
  label,
  icon,
}) => (
  <Link
    href={to}
    className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300 hover:bg-secondary"
  >
    <span className="text-4xl mb-2">{icon}</span>
    <span className="text-lg font-semibold text-primary">{label}</span>
  </Link>
);

const DashboardPage: React.FC = () => {
  const { bookings } = useAppContext();
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter(
      (b) =>
        b.status === BookingStatus.Paid || b.status === BookingStatus.Delivered
    )
    .reduce((sum, b) => sum + b.total, 0);
  const pendingPayout = totalRevenue * 0.7; // Assume 70% payout

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Bookings"
          value={totalBookings.toString()}
          description="All time bookings"
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          description="From paid bookings"
        />
        <DashboardCard
          title="Pending Payout"
          value={`$${pendingPayout.toFixed(2)}`}
          description="Estimated payout"
        />
      </div>

      <h2 className="text-2xl font-bold text-text-main mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <QuickLink to="/cart" label="New Booking" icon="🛒" />
        <QuickLink to="/customers" label="Manage Customers" icon="👥" />
        <QuickLink to="/products" label="Browse Products" icon="💎" />
        <QuickLink to="/bookings" label="View Bookings" icon="📋" />
      </div>
    </div>
  );
};

export default DashboardPage;
