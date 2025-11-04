"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserCircleIcon, LogoutIcon } from "./Icons";

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 
      bg-white/70 backdrop-blur-lg border-b border-violet-200 shadow-sm"
    >
      {/* Left section (brand or breadcrumbs) */}
      <h1
        className="text-lg font-serif font-bold tracking-wide bg-gradient-to-r 
        from-violet-600 via-purple-500 to-amber-400 bg-clip-text text-transparent"
      >
        AstroGems
      </h1>

      {/* Right: user avatar dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative z-10 block h-10 w-10 overflow-hidden rounded-full 
            flex items-center justify-center border border-violet-200 
            bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md 
            hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="User"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="w-7 h-7" />
          )}
        </button>

        {dropdownOpen && (
          <>
            <div
              onClick={() => setDropdownOpen(false)}
              className="fixed inset-0 z-10"
            ></div>

            <div
              className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-md 
              border border-violet-100 rounded-xl shadow-xl z-20 overflow-hidden"
            >
              {status === "authenticated" ? (
                <>
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-violet-700">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>

                  <div className="border-t border-violet-100"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-3 
                      text-sm text-violet-700 hover:bg-gradient-to-r 
                      hover:from-violet-500 hover:to-purple-600 hover:text-white 
                      transition-all"
                  >
                    <LogoutIcon className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Not signed in
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
