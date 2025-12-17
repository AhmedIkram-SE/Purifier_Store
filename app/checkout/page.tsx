"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import PaymentFormWrapper from "@/components/payment-form-wrapper";
import type { Order } from "@/models/Order";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStage, setPaymentStage] = useState<"shipping" | "payment">(
    "shipping"
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [saveBillingInfo, setSaveBillingInfo] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const next = "/checkout";
      router.push(`/auth/login?next=${encodeURIComponent(next)}`);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [isAuthenticated, user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 1: Submit shipping info and create payment intent
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get token from context or localStorage
      const authToken =
        token ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);

      if (!authToken) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Create payment intent
      const paymentResponse = await fetch(
        "/api/payments/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            totalPrice: totalPrice * 1.08, // Include tax
            customerEmail: formData.email,
            customerName: formData.name,
          }),
        }
      );

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to initialize payment");
      }

      const { clientSecret: secret, paymentIntentId: intentId } =
        await paymentResponse.json();

      setClientSecret(secret);
      setPaymentIntentId(intentId);
      setPaymentStage("payment");
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to process shipping info";
      setError(errorMsg);
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: After successful payment, create order
  const handlePaymentSuccess = async (stripePaymentIntentId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get token from context or localStorage
      const authToken =
        token ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);

      if (!authToken) {
        throw new Error("Authentication required. Please log in again.");
      }

      const orderData: Omit<Order, "_id" | "createdAt" | "updatedAt"> = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
        },
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageURL: item.imageURL,
        })),
        totalPrice: totalPrice * 1.08, // Including tax
        status: "processing",
        paymentIntentId: stripePaymentIntentId,
        paymentStatus: "succeeded",
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create order");
      }

      const order = await response.json();
      clearCart();
      router.push(`/order-confirmation/${order._id}`);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create order";
      setError(errorMsg);
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleBackToShipping = () => {
    setPaymentStage("shipping");
    setClientSecret(null);
    setError(null);
  };

  if (!isAuthenticated || authLoading) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => router.push("/products")}>
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {paymentStage === "shipping" ? (
              <>
                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="street">Street Address *</Label>
                        <Input
                          id="street"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Continue to Payment"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clientSecret && (
                      <PaymentFormWrapper
                        clientSecret={clientSecret}
                        customerEmail={formData.email}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        isLoading={loading}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Back Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToShipping}
                  disabled={loading}
                >
                  ← Back to Shipping
                </Button>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.imageURL || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(totalPrice * 0.08)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(totalPrice * 1.08)}
                    </span>
                  </div>
                </div>

                {paymentStage === "shipping" && (
                  <p className="text-xs text-muted-foreground text-center">
                    You will be able to enter payment details after confirming
                    your shipping information.
                  </p>
                )}

                {paymentStage === "payment" && (
                  <p className="text-xs text-muted-foreground text-center">
                    Your payment information is secure and processed by Stripe.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
