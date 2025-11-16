"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminApprovalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const adminEmails =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
  const isAdmin = adminEmails.includes(session?.user?.email || "");

  // Redirect non-admins
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (!isAdmin) {
      router.replace("/unauthorized");
      return;
    }

    loadPending();
  }, [status]);

  const loadPending = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/pending");
      const data = await res.json();
      setPendingUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (email: string) => {
    await fetch("/api/user/approve", {
      method: "PUT",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    alert(`Approved: ${email}`);
    loadPending();
  };

  const reject = async (email: string) => {
    const ok = confirm(`Reject and delete ${email}?`);
    if (!ok) return;

    await fetch("/api/user/reject", {
      method: "DELETE",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    alert(`Rejected & deleted: ${email}`);
    loadPending();
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">
        Loading pending approvals...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Pending User Approvals
        </h1>

        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending requests 🎉</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((u) => (
              <div
                key={u.email}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <p className="text-xs text-gray-400">
                    Requested: {new Date(u.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => approve(u.email)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(u.email)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
