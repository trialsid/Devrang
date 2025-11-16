import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function PUT(req: Request) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("devrang");

    await db
      .collection("user_profiles")
      .updateOne({ email }, { $set: { approved: true } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error approving user:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
