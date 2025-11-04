"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  ProductsIcon,
  CustomersIcon,
  BookingsIcon,
  CartIcon,
} from "./Icons";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const baseLinkClasses =
    "flex items-center gap-3 px-6 py-3 text-violet-200 hover:text-white transition-all duration-300 rounded-xl mx-3 my-1";
  const activeLinkClasses =
    "bg-gradient-to-r from-violet-600/80 to-amber-400/60 text-white shadow-md shadow-violet-400/20";

  const getLinkClass = (path: string) => {
    return `${baseLinkClasses} ${
      pathname === path ? activeLinkClasses : "hover:bg-violet-700/40"
    }`;
  };

  return (
    <aside
      className="hidden md:flex flex-col w-64 
      bg-gradient-to-b from-[#f9f8ff]/70 via-[#f3edff]/40 to-[#ebe2ff]/10
      backdrop-blur-lg border-r border-violet-200/40 shadow-lg shadow-violet-100/10"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-center h-20 border-b border-violet-200/30 backdrop-blur-md">
        <h1 className="text-2xl font-serif font-bold tracking-wider bg-gradient-to-r from-violet-600 via-purple-500 to-amber-400 bg-clip-text text-transparent">
          AstroGems
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 space-y-1">
        <Link href="/dashboard" className={getLinkClass("/dashboard")}>
          <DashboardIcon className="w-5 h-5 opacity-90" />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        <Link href="/products" className={getLinkClass("/products")}>
          <ProductsIcon className="w-5 h-5 opacity-90" />
          <span className="text-sm font-medium">Products</span>
        </Link>
        <Link href="/customers" className={getLinkClass("/customers")}>
          <CustomersIcon className="w-5 h-5 opacity-90" />
          <span className="text-sm font-medium">Customers</span>
        </Link>
        <Link href="/bookings" className={getLinkClass("/bookings")}>
          <BookingsIcon className="w-5 h-5 opacity-90" />
          <span className="text-sm font-medium">Bookings</span>
        </Link>
        <Link href="/cart" className={getLinkClass("/cart")}>
          <CartIcon className="w-5 h-5 opacity-90" />
          <span className="text-sm font-medium">Cart / New Booking</span>
        </Link>
      </nav>

      {/* Footer / Signature */}
      <div className="mt-auto py-4 border-t border-violet-200/30 text-center text-xs text-violet-400">
        <p>© {new Date().getFullYear()} AstroGems</p>
      </div>
    </aside>
  );
};

export default Sidebar;
