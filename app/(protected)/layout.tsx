"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Step 1: Redirect if no session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // Step 2: Fetch user profile (role + approved)
  useEffect(() => {
    if (status !== "authenticated") return;

    const loadProfile = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();

        if (data.error) {
          router.replace("/auth/error?error=UNKNOWN_USER");
          return;
        }

        setRole(data.role);
        setApproved(data.approved);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [status, router]);

  // Step 3: Loading states
  if (status === "loading" || loadingProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        Checking permissions...
      </div>
    );
  }

  // Step 4: Reject unapproved users
  if (approved === false && role !== "admin") {
    router.replace("/auth/error?error=NOT_APPROVED");
    return null;
  }

  // Step 5: Only admin or approved users can see dashboard
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
