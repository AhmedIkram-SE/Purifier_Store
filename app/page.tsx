// Server Side Page for SEO
import HomePage from "./homepage";

export const metadata = {
  title: "PureLife – Premium Water & Air Purifiers for Healthy Living",
  description:
    "PureLife offers cutting-edge air and water purification systems designed for clean, healthy living. Shop online for the best purifiers in the market.",
  openGraph: {
    title: "PureLife – Premium Water & Air Purifiers",
    description:
      "Shop high-performance air and water purifiers that ensure a cleaner, healthier home.",
    url: "https://purelife.dev",
    type: "website",
  },
  alternates: {
    canonical: "https://purelife.dev",
  },
};

export default function Home() {
  return <HomePage />;
}
