import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse .env.local file manually
try {
  const envPath = resolve(__dirname, "../.env.local");
  const envFile = readFileSync(envPath, "utf8");

  envFile.split("\n").forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith("#")) {
      const equalIndex = line.indexOf("=");
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex).trim();
        const value = line
          .substring(equalIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  });
} catch (error) {
  console.error("Could not load .env.local file:", error.message);
}

const MONGODB_URI = process.env.MONGODB_URI;

// Validate that MONGODB_URI is loaded
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable not found!");
  console.error("Make sure .env.local file exists with MONGODB_URI set.");
  process.exit(1);
}

console.log("✅ MONGODB_URI loaded successfully");

// Helper function to generate slugs from product names
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace spaces/symbols with hyphens
    .replace(/(^-|-$)+/g, ""); // Trim hyphens from start/end
}

async function addSlugs() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("[PureLife] Connected to MongoDB");

    const db = client.db("purifier_store");
    const productsCollection = db.collection("products");

    const products = await productsCollection.find({}).toArray();
    console.log(`[PureLife] Found ${products.length} products.`);

    for (const product of products) {
      if (!product.slug && product.name) {
        const slug = generateSlug(product.name);

        await productsCollection.updateOne(
          { _id: product._id },
          { $set: { slug, updatedAt: new Date() } }
        );

        console.log(`[Updated] ${product.name} → ${slug}`);
      } else {
        console.log(`[Skipped] ${product.name} already has slug.`);
      }
    }

    console.log("[PureLife] ✅ Slug update completed successfully!");
  } catch (error) {
    console.error("[PureLife] ❌ Error adding slugs:", error);
  } finally {
    await client.close();
  }
}

addSlugs();
