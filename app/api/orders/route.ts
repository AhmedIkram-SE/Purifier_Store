import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Order } from "@/models/Order"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const orderData: Omit<Order, "_id" | "createdAt" | "updatedAt" | "userId"> = await request.json()

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    const newOrder = {
      ...orderData,
      userId: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(newOrder)

    // Optional: clear server cart after successful order
    await db.collection("carts").updateOne({ userId: decoded.userId }, { $set: { items: [], updatedAt: new Date() } })

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...newOrder,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    // If admin, return all orders; if customer, return only their orders
    const filter = decoded.role === "admin" ? {} : { userId: decoded.userId }
    const orders = await db.collection("orders").find(filter).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
