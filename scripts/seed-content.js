// Seed script to populate initial content for About and Contact pages

import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = "purifier_store"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

async function seedContent() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB for content seeding")

    const db = client.db(DB_NAME)

    // Seed About page content
    const aboutContent = {
      type: "about",
      title: "About PureLife",
      description:
        "We're dedicated to providing premium water and air purification solutions that create healthier environments for families worldwide.",
      sections: [
        {
          heading: "Our Mission",
          content:
            "To make clean air and pure water accessible to every household through innovative purification technology and exceptional customer service.",
        },
        {
          heading: "Our Values",
          content:
            "Quality, innovation, and customer care are at the heart of everything we do. We believe everyone deserves a healthy home environment.",
        },
        {
          heading: "Our Commitment",
          content:
            "We're committed to continuous innovation, sustainable practices, and providing the highest quality products backed by comprehensive warranties and expert support.",
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert or update about content
    await db.collection("content").updateOne({ type: "about" }, { $set: aboutContent }, { upsert: true })
    console.log("About page content seeded successfully")

    // Seed sample contact queries (for testing admin functionality)
    const sampleQueries = [
      {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        query:
          "I'm interested in learning more about your water purification systems. Can you recommend the best option for a family of four?",
        status: "new",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 987-6543",
        query:
          "My air purifier stopped working after 6 months. It's still under warranty. How can I get it repaired or replaced?",
        status: "in-progress",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        name: "Mike Davis",
        email: "mike.davis@email.com",
        phone: "",
        query:
          "Do you offer installation services in the Chicago area? I just purchased a whole-house water filtration system.",
        status: "resolved",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ]

    // Only insert sample queries if the collection is empty
    const existingQueries = await db.collection("contact_queries").countDocuments()
    if (existingQueries === 0) {
      await db.collection("contact_queries").insertMany(sampleQueries)
      console.log("Sample contact queries seeded successfully")
    } else {
      console.log("Contact queries collection already has data, skipping sample data")
    }

    console.log("Content seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding content:", error)
    throw error
  } finally {
    await client.close()
  }
}

// Run the seeding
seedContent().catch(console.error)
