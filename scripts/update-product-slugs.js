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

// Helper function to generate slugs with category
function generateSlug(name, category) {
  // Convert category to readable format
  const categorySlug = category.replace(/-/g, " ");

  // Combine category and name
  const fullText = `${categorySlug} ${name}`;

  return fullText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function updateProductSlugs() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("[PureLife] Connected to MongoDB");

    const db = client.db("purifier_store");
    const productsCollection = db.collection("products");

    const products = await productsCollection.find({}).toArray();
    console.log(`[PureLife] Found ${products.length} products to update.`);

    for (const product of products) {
      const oldSlug = product.slug;
      const newSlug = generateSlug(product.name, product.category);

      if (oldSlug !== newSlug) {
        await productsCollection.updateOne(
          { _id: product._id },
          {
            $set: {
              slug: newSlug,
              updatedAt: new Date(),
            },
          }
        );

        console.log(`[Updated] ${product.name}`);
        console.log(`  Old slug: ${oldSlug}`);
        console.log(`  New slug: ${newSlug}`);
        console.log("");
      } else {
        console.log(`[Skipped] ${product.name} - slug already correct`);
      }
    }

    console.log("[PureLife] ✅ Product slugs updated successfully!");
  } catch (error) {
    console.error("[PureLife] ❌ Error updating product slugs:", error);
  } finally {
    await client.close();
  }
}

updateProductSlugs();
