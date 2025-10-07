import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/purifier-ecommerce"

const sampleProducts = [
  // Water Purifiers
  {
    name: "AquaPure Pro 7-Stage RO System",
    description:
      "Advanced 7-stage reverse osmosis water purification system with UV sterilization and mineral enhancement. Perfect for families seeking the purest drinking water.",
    price: 299.99,
    category: "Water Purifiers",
    image: "/modern-white-water-purifier-system.jpg",
    inStock: true,
    specifications: {
      "Filtration Stages": "7-Stage RO + UV",
      "Daily Capacity": "50 Gallons",
      "Tank Capacity": "3.2 Gallons",
      Dimensions: '16" x 6" x 18"',
      Warranty: "3 Years",
      Installation: "Under-sink",
    },
    features: [
      "7-stage advanced filtration",
      "UV sterilization technology",
      "Mineral enhancement cartridge",
      "Smart leak detection",
      "Easy filter replacement",
      "NSF certified components",
    ],
  },
  {
    name: "HydroClean Countertop Filter",
    description:
      "Compact countertop water filter with activated carbon and ceramic filtration. No installation required - just plug and purify.",
    price: 149.99,
    category: "Water Purifiers",
    image: "/sleek-countertop-water-filter-white.jpg",
    inStock: true,
    specifications: {
      "Filtration Type": "Carbon + Ceramic",
      "Daily Capacity": "20 Gallons",
      "Filter Life": "6 Months",
      Dimensions: '12" x 8" x 14"',
      Warranty: "2 Years",
      Installation: "Countertop",
    },
    features: [
      "No installation required",
      "Activated carbon filtration",
      "Ceramic pre-filter",
      "LED filter indicator",
      "Compact design",
      "BPA-free materials",
    ],
  },
  {
    name: "FlowMaster Whole House System",
    description:
      "Complete whole house water filtration system with sediment, carbon, and scale reduction. Protects all your home's water outlets.",
    price: 599.99,
    category: "Water Purifiers",
    image: "/large-whole-house-water-filtration-system.jpg",
    inStock: true,
    specifications: {
      "Flow Rate": "15 GPM",
      "Filter Life": "12 Months",
      "Pipe Size": '1" NPT',
      Dimensions: '20" x 10" x 24"',
      Warranty: "5 Years",
      Installation: "Main water line",
    },
    features: [
      "Whole house protection",
      "High flow rate capacity",
      "Scale and sediment reduction",
      "Long-lasting filters",
      "Professional installation included",
      "Bypass valve included",
    ],
  },
  {
    name: "PureDrop Portable Filter Bottle",
    description:
      "Advanced portable water filter bottle with 4-stage filtration. Perfect for travel, hiking, and emergency preparedness.",
    price: 49.99,
    category: "Water Purifiers",
    image: "/modern-water-filter-bottle-blue.jpg",
    inStock: true,
    specifications: {
      Capacity: "24 oz",
      "Filter Life": "300 Refills",
      Filtration: "4-Stage",
      Material: "BPA-Free Tritan",
      Warranty: "1 Year",
      Weight: "1.2 lbs",
    },
    features: [
      "Portable and lightweight",
      "4-stage filtration system",
      "Leak-proof design",
      "Easy-grip handle",
      "Dishwasher safe",
      "Emergency preparedness ready",
    ],
  },

  // Air Purifiers
  {
    name: "AirMax HEPA Pro 500",
    description:
      "Professional-grade air purifier with True HEPA filtration and activated carbon. Covers up to 500 sq ft with whisper-quiet operation.",
    price: 249.99,
    category: "Air Purifiers",
    image: "/modern-white-air-purifier-tower.jpg",
    inStock: true,
    specifications: {
      "Coverage Area": "500 sq ft",
      "HEPA Grade": "True HEPA H13",
      "CADR Rating": "300 CFM",
      "Noise Level": "25-50 dB",
      Dimensions: '22" x 14" x 8"',
      Warranty: "3 Years",
    },
    features: [
      "True HEPA H13 filtration",
      "Activated carbon layer",
      "Smart air quality sensor",
      "Auto mode operation",
      "Sleep mode (ultra-quiet)",
      "Filter replacement indicator",
    ],
  },
  {
    name: "BreathEasy Compact Desktop",
    description:
      "Compact desktop air purifier perfect for small spaces. Features UV-C sanitization and ionic purification technology.",
    price: 89.99,
    category: "Air Purifiers",
    image: "/small-desktop-air-purifier-modern-design.jpg",
    inStock: true,
    specifications: {
      "Coverage Area": "150 sq ft",
      Filtration: "HEPA + UV-C + Ionic",
      Power: "25W",
      "Noise Level": "20-35 dB",
      Dimensions: '8" x 8" x 12"',
      Warranty: "2 Years",
    },
    features: [
      "Compact desktop size",
      "UV-C sanitization",
      "Ionic purification",
      "Touch control panel",
      "Night light function",
      "Energy efficient",
    ],
  },
  {
    name: "CleanAir Industrial 1000",
    description:
      "Heavy-duty air purifier designed for large spaces and commercial use. Multi-stage filtration with ozone-free operation.",
    price: 449.99,
    category: "Air Purifiers",
    image: "/large-industrial-air-purifier-black.jpg",
    inStock: true,
    specifications: {
      "Coverage Area": "1000 sq ft",
      "HEPA Grade": "Medical Grade H14",
      "CADR Rating": "500 CFM",
      "Filter Stages": "5-Stage",
      Dimensions: '28" x 16" x 12"',
      Warranty: "5 Years",
    },
    features: [
      "Medical-grade HEPA filtration",
      "5-stage purification process",
      "Commercial-grade construction",
      "Remote control included",
      "Programmable timer",
      "Ozone-free operation",
    ],
  },
  {
    name: "FreshAir Smart WiFi Purifier",
    description:
      "Smart WiFi-enabled air purifier with app control and real-time air quality monitoring. Voice assistant compatible.",
    price: 199.99,
    category: "Air Purifiers",
    image: "/smart-wifi-air-purifier-with-display.jpg",
    inStock: true,
    specifications: {
      "Coverage Area": "350 sq ft",
      Connectivity: "WiFi + App Control",
      "HEPA Grade": "True HEPA",
      "Smart Features": "Alexa & Google Compatible",
      Dimensions: '18" x 12" x 10"',
      Warranty: "3 Years",
    },
    features: [
      "WiFi connectivity and app control",
      "Real-time air quality display",
      "Voice assistant compatible",
      "Scheduling and automation",
      "Filter life tracking",
      "Energy Star certified",
    ],
  },
]

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@purifierstore.com",
    password: "admin123", // Will be hashed
    role: "admin",
  },
  {
    name: "John Customer",
    email: "john@example.com",
    password: "customer123", // Will be hashed
    role: "customer",
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("[v0] Connected to MongoDB")

    const db = client.db()

    // Clear existing data
    await db.collection("products").deleteMany({})
    await db.collection("users").deleteMany({})
    console.log("[v0] Cleared existing data")

    // Insert sample products
    const productResult = await db.collection("products").insertMany(sampleProducts)
    console.log(`[v0] Inserted ${productResult.insertedCount} products`)

    // Hash passwords and insert users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        createdAt: new Date(),
      })),
    )

    const userResult = await db.collection("users").insertMany(hashedUsers)
    console.log(`[v0] Inserted ${userResult.insertedCount} users`)

    console.log("[v0] Database seeding completed successfully!")
    console.log("[v0] Admin login: admin@purifierstore.com / admin123")
    console.log("[v0] Customer login: john@example.com / customer123")
  } catch (error) {
    console.error("[v0] Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
