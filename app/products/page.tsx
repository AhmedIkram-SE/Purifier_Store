"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/models/Product";
import { Filter, SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = new URL("/api/products", window.location.origin);
        if (category) {
          url.searchParams.set("category", category);
        }

        const response = await fetch(url.toString());
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const getPageTitle = () => {
    if (category === "water-purifier") return "Water Purifiers";
    if (category === "air-purifier") return "Air Purifiers";
    return "All Products";
  };

  const getPageDescription = () => {
    if (category === "water-purifier")
      return "Advanced water filtration systems for pure, clean drinking water";
    if (category === "air-purifier")
      return "HEPA air purifiers for cleaner, fresher indoor air quality";
    return "Browse our complete collection of water and air purification systems";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-muted-foreground">{getPageDescription()}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              {category && (
                <Badge variant="secondary">
                  {category === "water-purifier"
                    ? "Water Purifiers"
                    : "Air Purifiers"}
                </Badge>
              )}
              <span className="text-muted-foreground text-sm">
                {products.length} products found
              </span>
            </div>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button> */}
            {/* Single Filters Button (mobile only) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/products")}
                >
                  All Products
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    (window.location.href = "/products?category=water-purifier")
                  }
                >
                  Water Purifiers
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    (window.location.href = "/products?category=air-purifier")
                  }
                >
                  Air Purifiers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden md:block w-64 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Category
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant={!category ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => (window.location.href = "/products")}
                      >
                        All Products
                      </Button>
                      <Button
                        variant={
                          category === "water-purifier" ? "default" : "ghost"
                        }
                        size="sm"
                        className="w-full justify-start"
                        onClick={() =>
                          (window.location.href =
                            "/products?category=water-purifier")
                        }
                      >
                        Water Purifiers
                      </Button>
                      <Button
                        variant={
                          category === "air-purifier" ? "default" : "ghost"
                        }
                        size="sm"
                        className="w-full justify-start"
                        onClick={() =>
                          (window.location.href =
                            "/products?category=air-purifier")
                        }
                      >
                        Air Purifiers
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button onClick={() => (window.location.href = "/products")}>
                  View All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
