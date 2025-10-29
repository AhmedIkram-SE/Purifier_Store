import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, FileText, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "My Warranty | PureLife",
  description:
    "Learn about PureLife warranty coverage, duration, and claim process for water and air purifiers.",
  openGraph: {
    title: "My Warranty | PureLife",
    description:
      "Learn about PureLife warranty coverage, duration, and claim process for water and air purifiers.",
    url: "https://purelife.dev/warranty",
  },
};

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-bold text-primary">My Warranty</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Comprehensive warranty coverage for all PureLife products. We stand
            behind our quality.
          </p>
        </div>

        {/* Warranty Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-2">2 Years</p>
              <p className="text-muted-foreground text-sm">
                Full coverage from date of purchase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-2">100%</p>
              <p className="text-muted-foreground text-sm">
                Manufacturing defects and parts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-2">24/7</p>
              <p className="text-muted-foreground text-sm">
                Expert customer support available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Warranty Coverage Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Covered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge className="mt-1">✓</Badge>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Manufacturing Defects
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    All defects in materials and workmanship under normal use
                    conditions
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="mt-1">✓</Badge>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Parts Replacement
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Free replacement of defective parts including filters,
                    motors, and electronics
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="mt-1">✓</Badge>
                <div>
                  <h4 className="font-semibold text-foreground">Labor Costs</h4>
                  <p className="text-muted-foreground text-sm">
                    Covered for repairs performed at authorized service centers
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="mt-1">✓</Badge>
                <div>
                  <h4 className="font-semibold text-foreground">Shipping</h4>
                  <p className="text-muted-foreground text-sm">
                    Free shipping for warranty repairs within the continental
                    United States
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Not Covered */}
        <Card className="mb-8 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              What's Not Covered
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>• Damage from misuse, abuse, or accidents</li>
              <li>
                • Normal wear and tear of consumable parts (filters, cartridges)
              </li>
              <li>• Damage from improper installation or maintenance</li>
              <li>• Water damage from external sources or flooding</li>
              <li>• Cosmetic damage that doesn't affect functionality</li>
              <li>• Damage from unauthorized repairs or modifications</li>
              <li>• Damage from power surges or electrical issues</li>
            </ul>
          </CardContent>
        </Card>

        {/* Warranty Claim Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to File a Warranty Claim</CardTitle>
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
                    Contact Our Support Team
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Call 1-800-PURELIFE or email support@purelife.com with your
                    product details and issue description
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
                    Provide Proof of Purchase
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Submit your original receipt or order confirmation. Warranty
                    is valid from the purchase date.
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
                    Troubleshooting & Diagnosis
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Our support team will help diagnose the issue and determine
                    if it's covered under warranty
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
                    Repair or Replacement
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    We'll arrange for repair or replacement at no cost. Most
                    claims are processed within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extended Warranty */}
        <Card>
          <CardHeader>
            <CardTitle>Extended Warranty Options</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Extend your coverage beyond the standard 2-year warranty with our
              extended protection plans:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">
                    3-Year Extended Warranty
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Additional 1 year of coverage
                  </p>
                </div>
                <p className="font-semibold text-primary">$49</p>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">
                    5-Year Extended Warranty
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Additional 3 years of coverage
                  </p>
                </div>
                <p className="font-semibold text-primary">$99</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
