"use client";

import React from "react";
import { AppProvider } from "../context/AppContext";
import { AuthProvider } from "../context/AuthContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <SessionProvider>{children}</SessionProvider>
      </AppProvider>
    </AuthProvider>
  );
}
