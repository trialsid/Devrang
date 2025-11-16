import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("devrang");

  const profile = await db
    .collection("user_profiles")
    .findOne({ email: session.user.email });

  if (!profile) {
    return NextResponse.json({ error: "UNKNOWN_USER" }, { status: 404 });
  }

  return NextResponse.json({
    email: profile.email,
    role: profile.role,
    approved: profile.approved,
  });
}
