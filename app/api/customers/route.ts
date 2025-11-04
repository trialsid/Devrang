import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("devrang");
    const customers = await db
      .collection("customers")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(customers);
  } catch (err) {
    console.error("❌ Error fetching customers:", err);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      shippingAddress,
      dob,
      gotra,
      rating,
      comments,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("devrang");

    const newCustomer = {
      name,
      phone,
      email: email || "",
      shippingAddress: shippingAddress || "",
      dob: dob || "",
      gotra: gotra || "",
      rating: rating || 0,
      comments: comments || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("customers").insertOne(newCustomer);
    return NextResponse.json({ _id: result.insertedId, ...newCustomer });
  } catch (err) {
    console.error("❌ Error creating customer:", err);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
