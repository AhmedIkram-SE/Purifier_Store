"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import type { Product } from "@/models/Product";
import {
  ChevronRight,
  Shield,
  Truck,
  Award,
  Droplets,
  Wind,
} from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const products = await response.json();
        // Show first 4 products as featured
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900" />

        {/* Content container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center">
            {/* Text and buttons - centered on mobile, left side on desktop */}
            <div className="flex flex-col justify-center space-y-6 md:space-y-8 text-center md:text-left">
              <div className="space-y-4 md:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight text-balance">
                  PureLife — Breathe Pure, Live Better
                </h1>
                <p className="text-base sm:text-lg md:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto md:mx-0">
                  Experience premium air and water purification technology
                  designed for your healthier lifestyle
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/products?category=air-purifier"
                  className="flex-1 sm:flex-none"
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products" className="flex-1 sm:flex-none">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-transparent"
                  >
                    Explore Products
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Image with fade effect (desktop only) */}
            <div className="hidden md:flex relative h-full min-h-[500px] items-center justify-center">
              {/* Image container with gradient fade */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white dark:to-slate-800 pointer-events-none z-10" />
                <Image
                  src="/premium-air-purifier-hero.jpg"
                  alt="Premium Air Purifier"
                  fill
                  className="object-cover object-center rounded-lg"
                  priority
                  sizes="50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our specialized collection of water and air
              purification systems
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/products?category=water-purifier">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <Droplets className="h-16 w-16 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Water Purifiers
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced filtration systems for pure, clean drinking water
                  </p>
                  <Badge variant="secondary">View Collection</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products?category=air-purifier">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <Wind className="h-16 w-16 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Air Purifiers
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    HEPA filtration technology for cleaner, fresher indoor air
                  </p>
                  <Badge variant="secondary">View Collection</Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular water and air purification systems
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted rounded-t-lg"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  Quality Guaranteed
                </h3>
                <p className="text-muted-foreground text-sm">
                  Premium filtration technology with certified quality standards
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Truck className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  Free Shipping
                </h3>
                <p className="text-muted-foreground text-sm">
                  Free delivery on all orders over $99 nationwide
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  2 Year Warranty
                </h3>
                <p className="text-muted-foreground text-sm">
                  Comprehensive warranty coverage on all products
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Droplets className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  Expert Support
                </h3>
                <p className="text-muted-foreground text-sm">
                  24/7 customer support from water and air quality experts
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
