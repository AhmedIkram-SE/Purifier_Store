import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PureLife - Water & Air Purifiers",
    template: "%s | PureLife",
  },
  description:
    "Shop advanced water and air purifiers at PureLife. Breathe cleaner air and drink pure water with our premium purification systems.",
  keywords: [
    "PureLife",
    "air purifiers",
    "water purifiers",
    "reverse osmosis filter",
    "whole house filter",
    "air quality",
    "eco purifier",
    "ecommerce",
    "home filtration",
    "healthy living",
    "pollution control",
    "Brita water filter alternative",
  ],
  authors: [{ name: "PureLife" }],
  creator: "PureLife",
  openGraph: {
    title: "PureLife – Clean Water & Air Purifiers",
    description:
      "Explore PureLife’s range of air and water purification systems designed for a healthier home.",
    url: "https://purelife.dev",
    siteName: "PureLife",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PureLife - Air & Water Purifiers",
    description:
      "High-quality purification systems for every home. Shop PureLife now.",
    creator: "@purelife",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
