import { MongoClient } from "mongodb"

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  if (clientPromise) {
    return clientPromise
  }

  const uri = process.env.MONGODB_URI
  const options = {}

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

// Export a function that returns the client promise instead of the promise itself
export default getClientPromise
