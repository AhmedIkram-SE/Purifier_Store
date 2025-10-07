import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
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
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
