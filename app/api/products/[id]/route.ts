import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await getClientPromise()
    const db = client.db("purifier_store")

    const product = await db.collection("products").findOne({
      _id: new ObjectId(params.id),
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
