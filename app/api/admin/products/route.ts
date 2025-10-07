import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Product } from "@/models/Product"

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const productData: Omit<Product, "_id" | "createdAt" | "updatedAt"> = await request.json()

    // Validate required fields
    if (!productData.name || !productData.category || !productData.price) {
      return NextResponse.json({ error: "Name, category, and price are required" }, { status: 400 })
    }

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    const newProduct = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(newProduct)

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...newProduct,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
