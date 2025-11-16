"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");

  if (error === "NOT_APPROVED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
        <h1 className="text-2xl font-bold text-red-600">
          Your Account Is Not Approved Yet
        </h1>
        <p className="text-gray-600 mt-4 text-center">
          Your registration is successful, but an administrator must approve
          your account before you can log in.
        </p>
      </div>
    );
  }

  return <p className="p-10">Authentication Error</p>;
}
