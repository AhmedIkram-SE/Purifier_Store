"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck } from "lucide-react"

export default function OrderConfirmationPage() {
  const [orderPlaced, setOrderPlaced] = useState(false)
  const params = useParams()

  useEffect(() => {
    // Simulate order confirmation
    setOrderPlaced(true)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-medium">#{params.id?.toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated Delivery:</span>
              <span className="font-medium">5-7 business days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Order Processing</h4>
                  <p className="text-muted-foreground text-sm">
                    We're preparing your items for shipment. You'll receive an email confirmation shortly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Shipping</h4>
                  <p className="text-muted-foreground text-sm">
                    Once shipped, you'll receive tracking information to monitor your package.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Delivery</h4>
                  <p className="text-muted-foreground text-sm">
                    Your order will be delivered to your specified address within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              View All Orders
            </Button>
          </Link>
          <Link href="/products">
            <Button className="w-full sm:w-auto">Continue Shopping</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
