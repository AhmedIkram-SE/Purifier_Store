import { type NextRequest, NextResponse } from "next/server";
import {
  sendOrderConfirmationEmail,
  sendShippedNotificationEmail,
} from "@/lib/email";
import type { Order } from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    const { type, order } = (await request.json()) as {
      type: "order_confirmation" | "shipped_notification";
      order: Order & { _id: string };
    };

    if (!type || !order) {
      return NextResponse.json(
        { error: "Missing type or order data" },
        { status: 400 }
      );
    }

    if (type === "order_confirmation") {
      await sendOrderConfirmationEmail({ order });
    } else if (type === "shipped_notification") {
      await sendShippedNotificationEmail({ order });
    } else {
      return NextResponse.json(
        { error: "Invalid email type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
