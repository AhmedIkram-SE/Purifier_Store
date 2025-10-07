import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await getClientPromise()
    const db = client.db("purifier_store")

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const inStock = searchParams.get("inStock")

    const filter: any = {}

    if (category) {
      filter.category = category
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseFloat(maxPrice)
    }

    if (inStock === "true") {
      filter.stock = { $gt: 0 }
    }

    const products = await db.collection("products").find(filter).toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
