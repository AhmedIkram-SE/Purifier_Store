import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Calendar, Package, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "My Returns | PureLife",
  description:
    "Easy returns and refund policy for PureLife water and air purifiers. 30-day satisfaction guarantee.",
  openGraph: {
    title: "My Returns | PureLife",
    description:
      "Easy returns and refund policy for PureLife water and air purifiers. 30-day satisfaction guarantee.",
    url: "https://purelife.dev/returns",
  },
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-bold text-primary">My Returns</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            We want you to be completely satisfied. If you're not happy, we make
            returns easy.
          </p>
        </div>

        {/* Return Policy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Return Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-2">30 Days</p>
              <p className="text-muted-foreground text-sm">
                From date of purchase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                Refund
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-2">100%</p>
              <p className="text-muted-foreground text-sm">
                Full refund of purchase price
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-2">Free</p>
              <p className="text-muted-foreground text-sm">
                Return shipping label provided
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Return Eligibility */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Return Eligibility Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              To be eligible for a return, your product must meet the following
              conditions:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge className="mt-1">✓</Badge>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Within 30 Days
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Return must be initiated within 30 days of purchase
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="mt-1">✓</Badge>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Original Condition
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Product must be in original, unused condition with all
                    original packaging and accessories
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="mt-1">✓</Badge>
                <div>
                  <h4 className="font-semibold text-foreground">No Damage</h4>
                  <p className="text-muted-foreground text-sm">
                    Product must not show signs of damage, wear, or misuse
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="mt-1">✓</Badge>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Proof of Purchase
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Original receipt or order confirmation must be provided
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="mt-1">✓</Badge>
                <div>
                  <h4 className="font-semibold text-foreground">
                    All Components
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    All original parts, filters, manuals, and accessories must
                    be included
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Return a Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground font-semibold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Initiate Return Request
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Contact our customer service at support@purelife.com or call
                    1-800-PURELIFE within 30 days of purchase
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground font-semibold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Receive Return Authorization
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    We'll provide you with a return authorization number (RMA)
                    and prepaid shipping label
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground font-semibold">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Pack and Ship
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Securely pack the product in original packaging and ship
                    using the provided label
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground font-semibold">
                    4
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Inspection & Refund
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    We'll inspect the product and process your refund within 5-7
                    business days of receipt
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Refund Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Refund Amount
                </h4>
                <p className="text-muted-foreground text-sm">
                  Full refund of the product purchase price. Shipping costs are
                  non-refundable unless the return is due to our error.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Processing Time
                </h4>
                <p className="text-muted-foreground text-sm">
                  Refunds are processed within 5-7 business days of receiving
                  and inspecting your return. The refund will be credited to
                  your original payment method.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Return Shipping
                </h4>
                <p className="text-muted-foreground text-sm">
                  We provide a prepaid return shipping label. If you choose to
                  use a different carrier, return shipping costs are your
                  responsibility.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Non-Returnable Items */}
        <Card>
          <CardHeader>
            <CardTitle>Non-Returnable Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The following items cannot be returned:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>• Replacement filters and cartridges (consumable items)</li>
              <li>• Clearance or final sale items</li>
              <li>• Items purchased more than 30 days ago</li>
              <li>• Damaged or heavily used products</li>
              <li>• Items without original packaging</li>
              <li>• Custom or personalized products</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
