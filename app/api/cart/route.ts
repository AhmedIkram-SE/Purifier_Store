import { NextResponse, type NextRequest } from "next/server"
import getClientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { CartItem } from "@/models/Cart"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded?.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    const cart = await db.collection("carts").findOne({ userId: decoded.userId })
    return NextResponse.json({ items: cart?.items ?? [] })
  } catch (err) {
    console.error("[cart.GET] error", err)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded?.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const body = await request.json()
    const items: CartItem[] = Array.isArray(body?.items) ? body.items : []

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    await db
      .collection("carts")
      .updateOne({ userId: decoded.userId }, { $set: { items, updatedAt: new Date() } }, { upsert: true })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[cart.PUT] error", err)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
