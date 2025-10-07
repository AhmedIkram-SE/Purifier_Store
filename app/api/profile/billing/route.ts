import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

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

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password: 0 } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      billingInfo: user.billingInfo || null,
    })
  } catch (error) {
    console.error("Error fetching billing info:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { billingInfo } = await request.json()

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          billingInfo,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Billing info saved successfully" })
  } catch (error) {
    console.error("Error saving billing info:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
