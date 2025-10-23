// Server Side Rendered Page
import { Metadata } from "next";
import ProductsPage from "./products";

// Dynamic metadata based on category param
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { category?: string };
}): Promise<Metadata> {
  const category = searchParams?.category;

  let title = "Shop All Products | PureLife";
  let description =
    "Explore all PureLife water and air purifiers. Find the perfect purification system for your home or office.";
  let url = "https://purelife.dev/products";

  if (category === "water-purifier") {
    title = "Water Purifiers | PureLife";
    description =
      "Discover PureLife's advanced water filtration systems for clean, healthy drinking water.";
    url = "https://purelife.dev/products?category=water-purifier";
  } else if (category === "air-purifier") {
    title = "Air Purifiers | PureLife";
    description =
      "Shop the best HEPA air purifiers by PureLife for fresher indoor air.";
    url = "https://purelife.dev/products?category=air-purifier";
  }

  return {
    title,
    description,
    keywords: [
      "PureLife",
      "air purifier",
      "water purifier",
      "home filters",
      "eco purifiers",
      "reverse osmosis water filter",
      "air quality improvement",
    ],
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: "/opengraph-image.jpg", // optional fallback
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    alternates: { canonical: url },
  };
}

// Render your existing client page
export default function ProductsPageWrapper() {
  return <ProductsPage />;
}
