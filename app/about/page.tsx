// Server Side Rendered Page
import AboutPage from "./about";

export const metadata = {
  title: "About PureLife | Our Mission for Clean Air & Water",
  description:
    "At PureLife, we believe everyone deserves clean air and pure water. Learn about our journey, our technology, and our commitment to healthier living.",
  openGraph: {
    title: "About PureLife",
    description:
      "Learn about PureLife’s mission and commitment to clean air and water for everyone.",
    url: "https://purelife.dev/about",
  },
  alternates: {
    canonical: "https://purelife.dev/about",
  },
};
export default function About() {
  return <AboutPage />;
}
