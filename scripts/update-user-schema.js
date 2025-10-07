// Script to update existing user documents to include the new billingInfo field

import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = "purifier_store"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

async function updateUserSchema() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB for user schema update")

    const db = client.db(DB_NAME)

    // Update all users to include billingInfo field if it doesn't exist
    const result = await db.collection("users").updateMany(
      { billingInfo: { $exists: false } },
      {
        $set: {
          billingInfo: null,
          updatedAt: new Date(),
        },
      },
    )

    console.log(`Updated ${result.modifiedCount} user documents with billingInfo field`)

    // Add indexes for the new billing info fields
    await db.collection("users").createIndex({ "billingInfo.cardholderName": 1 })
    await db.collection("users").createIndex({ "billingInfo.billingAddress.zipCode": 1 })

    console.log("User schema update completed successfully!")
  } catch (error) {
    console.error("Error updating user schema:", error)
    throw error
  } finally {
    await client.close()
  }
}

// Run the schema update
updateUserSchema().catch(console.error)
