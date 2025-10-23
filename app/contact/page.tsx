// Serever Side Rendered Page
import ContactPage from "./contact";

export const metadata = {
  title: "Contact PureLife | Get in Touch with Us",
  description:
    "Have questions about our water or air purifiers? Contact the PureLife support team today for assistance or inquiries.",
  openGraph: {
    title: "Contact PureLife",
    description:
      "Reach out to PureLife for product inquiries, support, or business opportunities.",
    url: "https://purelife.dev/contact",
  },
  alternates: {
    canonical: "https://purelife.dev/contact",
  },
};
export default function Contact() {
  return <ContactPage />;
}
