import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("devrang");

    const data = await db
      .collection("user_profiles")
      .find({ approved: false, role: "user" }) // users only
      .project({ name: 1, email: 1, createdAt: 1 })
      .toArray();

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error fetching pending users:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
