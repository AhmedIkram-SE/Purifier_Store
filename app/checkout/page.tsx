"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import type { Order } from "@/models/Order";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
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

  const [billingData, setBillingData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",
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

      // Load saved billing info if available
      const loadBillingInfo = async () => {
        try {
          const response = await fetch("/api/profile/billing");
          if (response.ok) {
            const data = await response.json();
            if (data.billingInfo) {
              setBillingData((prev) => ({
                ...prev,
                cardholderName: data.billingInfo.cardholderName || "",
                billingStreet: data.billingInfo.billingAddress?.street || "",
                billingCity: data.billingInfo.billingAddress?.city || "",
                billingState: data.billingInfo.billingAddress?.state || "",
                billingZipCode: data.billingInfo.billingAddress?.zipCode || "",
                billingCountry:
                  data.billingInfo.billingAddress?.country || "United States",
              }));
            }
          }
        } catch (error) {
          console.error("Error loading billing info:", error);
        }
      };

      loadBillingInfo();
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

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingData({
      ...billingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/auth/login?next=${encodeURIComponent("/checkout")}`);
      return;
    }
    setLoading(true);

    try {
      if (saveBillingInfo && isAuthenticated) {
        const billingInfoToSave = {
          cardholderName: billingData.cardholderName,
          billingAddress: {
            street: billingData.billingStreet,
            city: billingData.billingCity,
            state: billingData.billingState,
            zipCode: billingData.billingZipCode,
            country: billingData.billingCountry,
          },
        };

        await fetch("/api/profile/billing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ billingInfo: billingInfoToSave }),
        });
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
        status: "pending",
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        clearCart();
        router.push(`/order-confirmation/${order._id}`);
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card & Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={billingData.cardNumber}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          value = value.replace(/(.{4})/g, "$1 ").trim();
                          handleBillingChange({
                            target: { name: "cardNumber", value },
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        maxLength={19}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name *</Label>
                      <Input
                        id="cardholderName"
                        name="cardholderName"
                        value={billingData.cardholderName}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={billingData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length > 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2);
                          }
                          handleBillingChange({
                            target: { name: "expiryDate", value },
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={billingData.cvv}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length > 3) {
                            value = value.slice(0, 3);
                          }
                          handleBillingChange({
                            target: { name: "cvv", value },
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">
                      Billing Address
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="billingStreet">Street Address *</Label>
                    <Input
                      id="billingStreet"
                      name="billingStreet"
                      value={billingData.billingStreet}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billingCity">City *</Label>
                      <Input
                        id="billingCity"
                        name="billingCity"
                        value={billingData.billingCity}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingState">State *</Label>
                      <Input
                        id="billingState"
                        name="billingState"
                        value={billingData.billingState}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingZipCode">ZIP Code *</Label>
                      <Input
                        id="billingZipCode"
                        name="billingZipCode"
                        value={billingData.billingZipCode}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                  </div>

                  {isAuthenticated && (
                    <div className="flex items-center space-x-2 pt-4">
                      <Checkbox
                        id="saveBillingInfo"
                        checked={saveBillingInfo}
                        onCheckedChange={(checked) =>
                          setSaveBillingInfo(checked as boolean)
                        }
                      />
                      <Label htmlFor="saveBillingInfo" className="text-sm">
                        Save this info for later purchases
                      </Label>
                    </div>
                  )}
                </CardContent>
              </Card>
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

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our terms and
                    conditions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
