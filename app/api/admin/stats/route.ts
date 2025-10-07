import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
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

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    // Get basic statistics
    const [totalProducts, totalOrders, totalUsers, recentOrders] = await Promise.all([
      db.collection("products").countDocuments(),
      db.collection("orders").countDocuments(),
      db.collection("users").countDocuments(),
      db.collection("orders").find().sort({ createdAt: -1 }).limit(5).toArray(),
    ])

    // Calculate total revenue
    const revenueResult = await db
      .collection("orders")
      .aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }])
      .toArray()

    const totalRevenue = revenueResult[0]?.total || 0

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
