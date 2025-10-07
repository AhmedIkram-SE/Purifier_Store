// Script to create an admin user for managing the application

import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = "purifier_store"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB for admin user creation")

    const db = client.db(DB_NAME)

    // Admin user details
    const adminEmail = "admin@purelife.com"
    const adminPassword = "admin123" // Change this to a secure password
    const adminName = "PureLife Admin"

    // Check if admin user already exists
    const existingAdmin = await db.collection("users").findOne({ email: adminEmail })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Create admin user
    const adminUser = {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(adminUser)

    console.log("Admin user created successfully!")
    console.log(`Admin ID: ${result.insertedId}`)
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log("⚠️  Please change the admin password after first login!")
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  } finally {
    await client.close()
  }
}

// Run the admin user creation
createAdminUser().catch(console.error)
