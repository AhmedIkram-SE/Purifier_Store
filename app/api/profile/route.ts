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
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        billingInfo: user.billingInfo || null,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    // Check if email is already taken by another user
    const existingUser = await db.collection("users").findOne({
      email,
      _id: { $ne: new ObjectId(decoded.userId) },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 })
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          name,
          email,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
