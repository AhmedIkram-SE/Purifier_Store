// Database initialization script for PureLife E-commerce
// This script sets up collections and indexes for the application

import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = "purifier_store"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(DB_NAME)

    // Create collections if they don't exist
    const collections = ["users", "products", "orders", "contact_queries", "content"]

    for (const collectionName of collections) {
      const collectionExists = await db.listCollections({ name: collectionName }).hasNext()
      if (!collectionExists) {
        await db.createCollection(collectionName)
        console.log(`Created collection: ${collectionName}`)
      } else {
        console.log(`Collection already exists: ${collectionName}`)
      }
    }

    // Create indexes for better performance
    console.log("Creating indexes...")

    // Users collection indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ role: 1 })

    // Products collection indexes
    await db.collection("products").createIndex({ category: 1 })
    await db.collection("products").createIndex({ price: 1 })
    await db.collection("products").createIndex({ stock: 1 })
    await db.collection("products").createIndex({ name: "text", description: "text" })

    // Orders collection indexes
    await db.collection("orders").createIndex({ userId: 1 })
    await db.collection("orders").createIndex({ status: 1 })
    await db.collection("orders").createIndex({ createdAt: -1 })
    await db.collection("orders").createIndex({ "customerInfo.email": 1 })

    // Contact queries collection indexes
    await db.collection("contact_queries").createIndex({ status: 1 })
    await db.collection("contact_queries").createIndex({ createdAt: -1 })
    await db.collection("contact_queries").createIndex({ email: 1 })

    // Content collection indexes
    await db.collection("content").createIndex({ type: 1 }, { unique: true })

    console.log("Database initialization completed successfully!")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  } finally {
    await client.close()
  }
}

// Run the initialization
initializeDatabase().catch(console.error)
