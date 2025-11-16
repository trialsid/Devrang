import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text(); // Raw body needed for signature verification
    const signature = req.headers.get("x-razorpay-signature");

    // ✅ Verify the webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(bodyText)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid Razorpay signature!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);
    const client = await clientPromise;
    const db = client.db("devrang");

    // ✅ Handle different event types
    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;

        await db.collection("orders").updateOne(
          {
            $or: [
              { order_id: payment.order_id },
              { paymentLink: payment.notes?.payment_link_id },
            ],
          },
          {
            $set: {
              status: "paid",
              payment_id: payment.id,
              payment_method: payment.method,
              paid_at: new Date(payment.created_at * 1000),
            },
          }
        );

        console.log("✅ Payment captured:", payment.id);
        break;
      }

      case "payment_link.paid": {
        const paymentLink = event.payload.payment_link.entity;

        await db.collection("orders").updateOne(
          { order_id: paymentLink.id },
          {
            $set: {
              status: "paid",
              paid_at: new Date(),
            },
          }
        );

        console.log("✅ Payment link paid:", paymentLink.id);
        break;
      }

      case "payment_link.expired": {
        const paymentLink = event.payload.payment_link.entity;
        await db
          .collection("orders")
          .updateOne(
            { order_id: paymentLink.id },
            { $set: { status: "expired" } }
          );
        console.log("⚠️ Payment link expired:", paymentLink.id);
        break;
      }

      default:
        console.log("Unhandled Razorpay event:", event.event);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
