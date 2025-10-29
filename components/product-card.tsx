"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/models/Product";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const inWishlist = isInWishlist(product._id!);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product._id!,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageURL: product.imageURL,
      stock: product.stock,
    });
  };
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=/products/${product._id}`);
      return;
    }

    if (inWishlist) {
      await removeFromWishlist(product._id!);
    } else {
      await addToWishlist(product._id!);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.imageURL || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category === "water-purifier"
                ? "Water Purifier"
                : "Air Purifier"}
            </Badge>
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2 w-full box-border">
        <Link href={`/products/${product.slug}`} className="flex-1 min-w-0">
          <Button
            variant="outline"
            className="w-full bg-transparent text-xs sm:text-sm md:text-sm flex items-center justify-center whitespace-normal break-words leading-tight text-center px-2 py-2"
          >
            View Details
          </Button>
        </Link>
        <Button
          className="flex-1 min-w-0 text-xs sm:text-sm md:text-sm flex items-center justify-center break-words leading-tight text-center "
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-1 sm:mr2 shrink-0" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
