import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import type { UserRegistration } from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password }: UserRegistration = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "customer" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)
    const user = { ...newUser, _id: result.insertedId.toString() }

    // Generate JWT token
    const token = generateToken(user)

    // Create response with token in cookie
    const response = NextResponse.json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
