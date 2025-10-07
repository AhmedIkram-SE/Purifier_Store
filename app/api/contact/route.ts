import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"
import type { ContactQuery } from "@/models/ContactQuery"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, query } = await request.json()

    // Validate required fields
    if (!name || !email || !query) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    const contactQuery: Omit<ContactQuery, "_id"> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      query: query.trim(),
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("contact_queries").insertOne(contactQuery)

    return NextResponse.json({
      message: "Contact query submitted successfully",
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error submitting contact query:", error)
    return NextResponse.json({ error: "Failed to submit contact query" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint is for admin use to view contact queries
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // You can add token verification here if needed for admin access
    // For now, we'll return a simple response
    const client = await getClientPromise()
    const db = client.db("purifier_store")

    const queries = await db.collection("contact_queries").find({}).sort({ createdAt: -1 }).limit(50).toArray()

    return NextResponse.json(queries)
  } catch (error) {
    console.error("Error fetching contact queries:", error)
    return NextResponse.json({ error: "Failed to fetch contact queries" }, { status: 500 })
  }
}
