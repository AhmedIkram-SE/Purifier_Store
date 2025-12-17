import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// Validate webhook signature
function validateWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Stripe.Event | null {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return null;
  }
}

async function getOrdersCollection() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not configured");
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("purifier_store");
    return db.collection("orders");
  } catch (error) {
    client.close();
    throw error;
  }
}

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.warn("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ received: true });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const body = await request.text();
  const event = validateWebhookSignature(body, signature, webhookSecret);

  if (!event) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  let client: MongoClient | null = null;

  try {
    client = new MongoClient(process.env.MONGODB_URI || "");
    await client.connect();
    const db = client.db("purifier_store");
    const ordersCollection = db.collection("orders");

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);

        // Update order payment status
        await ordersCollection.updateOne(
          { paymentIntentId: paymentIntent.id },
          {
            $set: {
              paymentStatus: "succeeded",
              status: "processing",
            },
          }
        );
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);

        // Update order payment status
        await ordersCollection.updateOne(
          { paymentIntentId: paymentIntent.id },
          {
            $set: {
              paymentStatus: "failed",
            },
          }
        );
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("Charge refunded:", charge.id);

        if (charge.payment_intent) {
          await ordersCollection.updateOne(
            { paymentIntentId: charge.payment_intent },
            {
              $set: {
                status: "cancelled",
              },
            }
          );
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
