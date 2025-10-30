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

async function addKeywordsToProducts() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("[PureLife] Connected to MongoDB");

    const db = client.db("purifier_store");
    const productsCollection = db.collection("products");

    // Find products that don't have the keywords field
    const products = await productsCollection
      .find({
        keywords: { $exists: false },
      })
      .toArray();

    console.log(
      `[PureLife] Found ${products.length} products without keywords field.`
    );

    if (products.length === 0) {
      console.log("[PureLife] ✅ All products already have keywords field!");
      return;
    }

    // Update each product to add an empty keywords array
    for (const product of products) {
      // Generate some default keywords based on product data
      const defaultKeywords = [];

      if (product.category === "water-purifier") {
        defaultKeywords.push(
          "water filter",
          "water purification",
          "clean water"
        );
      } else if (product.category === "air-purifier") {
        defaultKeywords.push(
          "air filter",
          "air purification",
          "clean air",
          "hepa filter"
        );
      }

      await productsCollection.updateOne(
        { _id: product._id },
        {
          $set: {
            keywords: defaultKeywords,
            updatedAt: new Date(),
          },
        }
      );

      console.log(
        `[Updated] ${product.name} → added keywords: [${defaultKeywords.join(
          ", "
        )}]`
      );
    }

    console.log(
      "[PureLife] ✅ Keywords field added to all products successfully!"
    );
  } catch (error) {
    console.error("[PureLife] ❌ Error adding keywords to products:", error);
  } finally {
    await client.close();
  }
}

addKeywordsToProducts();
