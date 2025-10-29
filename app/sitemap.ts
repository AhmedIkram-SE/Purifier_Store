import { MetadataRoute } from "next";
import { Product } from "@/models/Product";
import getClientPromise from "@/lib/mongodb";

async function getAllProducts(): Promise<Product[]> {
  try {
    const client = await getClientPromise();
    const db = client.db("purifier_store");
    const products = await db.collection("products").find({}).toArray();

    // Convert each product's _id to string and type as Product
    return products.map(
      (product) =>
        ({
          ...product,
          _id: product._id.toString(),
        } as Product)
    );
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  const productUrls = products.map((product) => ({
    url: `https://purelife.dev/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
  }));

  return [
    { url: "https://purelife.dev/", lastModified: new Date() },
    { url: "https://purelife.dev/products", lastModified: new Date() },
    { url: "https://purelife.dev/about", lastModified: new Date() },
    { url: "https://purelife.dev/contact", lastModified: new Date() },
    { url: "https://purelife.dev/warranty", lastModified: new Date() },
    { url: "https://purelife.dev/shipping-info", lastModified: new Date() },
    { url: "https://purelife.dev/returns", lastModified: new Date() },
    {
      url: "https://purelife.dev/products?category=water-purifier",
      lastModified: new Date(),
    },
    {
      url: "https://purelife.dev/products?category=air-purifier",
      lastModified: new Date(),
    },
    ...productUrls,
  ];
}
