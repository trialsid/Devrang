import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("devrang");

    // Delete from user_profiles
    await db.collection("user_profiles").deleteOne({ email });

    // Delete from NextAuth Users collection
    await db.collection("users").deleteOne({ email });

    // Delete from NextAuth Accounts collection
    await db.collection("accounts").deleteMany({ email });

    console.log(`❌ User rejected & deleted: ${email}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error rejecting user:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
