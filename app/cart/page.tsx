"use client"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!
            </p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.imageURL || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-lg font-bold text-primary mb-2">{formatPrice(item.price)}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.productId)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">{formatPrice(totalPrice * 0.08)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice * 1.08)}</span>
                </div>

                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center">Free shipping on all orders over $99</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
