import { type NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Content } from "@/models/Content"

export async function GET() {
  try {
    const client = await getClientPromise()
    const db = client.db("purifier_store")

    let aboutContent = await db.collection("content").findOne({ type: "about" })

    // If no content exists, create default content
    if (!aboutContent) {
      const defaultContent: Omit<Content, "_id"> = {
        type: "about",
        title: "About PureLife",
        description:
          "We're dedicated to providing premium water and air purification solutions that create healthier environments for families worldwide.",
        sections: [
          {
            heading: "Our Mission",
            content:
              "To make clean air and pure water accessible to every household through innovative purification technology.",
          },
          {
            heading: "Our Values",
            content:
              "Quality, innovation, and customer care are at the heart of everything we do. We believe everyone deserves a healthy home environment.",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await db.collection("content").insertOne(defaultContent)
      aboutContent = { ...defaultContent, _id: result.insertedId }
    }

    return NextResponse.json(aboutContent)
  } catch (error) {
    console.error("Error fetching about content:", error)
    return NextResponse.json({ error: "Failed to fetch about content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { title, description, sections } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const client = await getClientPromise()
    const db = client.db("purifier_store")

    const result = await db.collection("content").updateOne(
      { type: "about" },
      {
        $set: {
          title,
          description,
          sections: sections || [],
          updatedAt: new Date(),
        },
        $setOnInsert: {
          type: "about",
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ message: "About content updated successfully" })
  } catch (error) {
    console.error("Error updating about content:", error)
    return NextResponse.json({ error: "Failed to update about content" }, { status: 500 })
  }
}
