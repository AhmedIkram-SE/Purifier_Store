import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Globe, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information | PureLife",
  description:
    "Learn about PureLife shipping methods, delivery times, tracking, and international shipping options.",
  openGraph: {
    title: "Shipping Information | PureLife",
    description:
      "Learn about PureLife shipping methods, delivery times, tracking, and international shipping options.",
    url: "https://purelife.dev/shipping-info",
  },
};

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-bold text-primary">
              Shipping Information
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Fast, reliable shipping to get your purifiers to you quickly and
            safely.
          </p>
        </div>

        {/* Shipping Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Shipping Methods & Delivery Times</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Standard Shipping
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Continental United States
                    </p>
                  </div>
                  <Badge>FREE</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  Delivery: 5-7 business days
                </p>
                <p className="text-muted-foreground text-sm">
                  Orders over $99 qualify for free standard shipping. Tracking
                  information provided.
                </p>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Express Shipping
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Continental United States
                    </p>
                  </div>
                  <Badge variant="secondary">$19.99</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  Delivery: 2-3 business days
                </p>
                <p className="text-muted-foreground text-sm">
                  Fast delivery for urgent orders. Real-time tracking included.
                </p>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Overnight Shipping
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Continental United States
                    </p>
                  </div>
                  <Badge variant="secondary">$49.99</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  Delivery: Next business day
                </p>
                <p className="text-muted-foreground text-sm">
                  Premium overnight delivery. Signature required upon delivery.
                </p>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Alaska & Hawaii
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Special handling required
                    </p>
                  </div>
                  <Badge variant="secondary">$39.99</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  Delivery: 7-10 business days
                </p>
                <p className="text-muted-foreground text-sm">
                  Special shipping rates apply. Contact support for details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Processing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Order Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Processing Time
                </h4>
                <p className="text-muted-foreground text-sm">
                  Orders are processed within 1-2 business days. Orders placed
                  on weekends or holidays will be processed the next business
                  day.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Cutoff Time
                </h4>
                <p className="text-muted-foreground text-sm">
                  Orders placed before 2 PM EST on business days will be
                  processed the same day. Orders after 2 PM will be processed
                  the next business day.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Shipping Notification
                </h4>
                <p className="text-muted-foreground text-sm">
                  You'll receive an email with tracking information as soon as
                  your order ships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Track your order in real-time using the tracking number provided
              in your shipping confirmation email.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">
                How to Track Your Order
              </h4>
              <ol className="space-y-2 text-muted-foreground text-sm">
                <li>1. Check your email for the shipping confirmation</li>
                <li>2. Click the tracking link or copy the tracking number</li>
                <li>
                  3. Visit the carrier's website to view real-time updates
                </li>
                <li>4. Receive delivery notifications via email and SMS</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* International Shipping */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              International Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We currently ship to select countries. International orders may be
              subject to customs duties and taxes.
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Supported Countries
                </h4>
                <p className="text-muted-foreground text-sm">
                  Canada, Mexico, United Kingdom, Germany, France, Japan,
                  Australia, and more. Contact support for availability in your
                  country.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Shipping Costs
                </h4>
                <p className="text-muted-foreground text-sm">
                  International shipping costs vary by destination. Rates will
                  be calculated at checkout based on your location.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Delivery Time
                </h4>
                <p className="text-muted-foreground text-sm">
                  International orders typically take 10-21 business days
                  depending on destination and customs processing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Customs & Duties
                </h4>
                <p className="text-muted-foreground text-sm">
                  Customers are responsible for any customs duties, taxes, or
                  import fees. These are not included in the shipping cost.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Delivery Issues & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Delayed Delivery
                </h4>
                <p className="text-muted-foreground text-sm">
                  If your order is delayed beyond the estimated delivery date,
                  contact our support team. We'll investigate and provide
                  updates.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Damaged Shipment
                </h4>
                <p className="text-muted-foreground text-sm">
                  If your product arrives damaged, contact us immediately with
                  photos. We'll arrange a replacement or refund.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Lost Package
                </h4>
                <p className="text-muted-foreground text-sm">
                  If your package is lost, we'll file a claim with the carrier
                  and send a replacement at no cost.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <p className="font-semibold text-foreground mb-2">
                  Contact Support
                </p>
                <p className="text-muted-foreground text-sm">
                  Email: support@purelife.com | Phone: 1-800-PURELIFE | Hours:
                  24/7
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
