import getClientPromise from "@/lib/mongodb";
import type { Metadata } from "next";
import ProductDetailPage from "./ProductDetailPage";
import { Product } from "@/models/Product";

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const client = await getClientPromise();
    const db = client.db("purifier_store");
    const product = await db.collection("products").findOne({ slug });
    if (!product) return null;
    return { ...product, _id: product._id.toString() } as Product;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product Not Found | PureLife" };
  }

  const title = `${product.name} | PureLife`;
  const description =
    product.description?.slice(0, 150) ||
    "Explore our premium air and water purifiers.";

  return {
    title,
    description,
    keywords: [
      product.category,
      product.name,
      "PureLife",
      "air purifier",
      "water purifier",
      "eco filter",
      "reverse osmosis",
      "clean water",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://purelife.dev/products/${product.slug}`,
      images: [
        { url: product.imageURL, width: 800, height: 600, alt: product.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.imageURL],
    },
  };
}
export default function ProductDetail() {
  return <ProductDetailPage />;
}
