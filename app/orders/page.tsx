"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import type { Order } from "@/models/Order";
import { Package, Calendar, CreditCard } from "lucide-react";
import ReviewForm from "@/components/review-form";
import ReviewDisplay from "@/components/review-display";
import type { Review } from "@/models/Review";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingProductId, setReviewingProductId] = useState<string | null>(
    null
  );
  const [productReviews, setProductReviews] = useState<{
    [key: string]: Review;
  }>({});
  const [reviewsLoading, setReviewsLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, user, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        // Fetch reviews for each product in orders
        data.forEach((order: Order) => {
          order.items.forEach((item) => {
            fetchProductReview(item.productId);
          });
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReview = async (productId: string) => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (response.ok) {
        const reviews = await response.json();
        // Get user's review if exists
        const userReview = reviews.find((r: Review) => r.userId === user?._id);
        if (userReview) {
          setProductReviews((prev) => ({
            ...prev,
            [productId]: userReview,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async (
    productId: string,
    rating: number,
    comment: string
  ) => {
    setReviewsLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const existingReview = productReviews[productId];
      const method = existingReview && existingReview._id ? "PUT" : "POST";
      const url =
        existingReview && existingReview._id
          ? `/api/reviews/${existingReview._id}`
          : "/api/reviews";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProductReviews((prev) => ({
          ...prev,
          [productId]: data,
        }));
        setReviewingProductId(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }
    } catch (error: any) {
      throw error;
    } finally {
      setReviewsLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              No Orders Yet
            </h2>
            <p className="text-muted-foreground mb-8">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Button onClick={() => router.push("/products")}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order._id?.slice(-8)}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {formatDate(order.createdAt!.toString())}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          <span className="text-sm">
                            {formatPrice(order.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          <div className="flex gap-3">
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
                          {order.status === "delivered" && (
                            <div className="mt-3 ml-20">
                              {reviewingProductId === item.productId ? (
                                <ReviewForm
                                  productId={item.productId}
                                  productName={item.name}
                                  onSubmit={(rating, comment) =>
                                    handleSubmitReview(
                                      item.productId,
                                      rating,
                                      comment
                                    )
                                  }
                                  onCancel={() => setReviewingProductId(null)}
                                  isLoading={reviewsLoading[item.productId]}
                                  existingReview={
                                    productReviews[item.productId]
                                  }
                                />
                              ) : productReviews[item.productId] ? (
                                <div className="space-y-2">
                                  <ReviewDisplay
                                    review={productReviews[item.productId]}
                                    isUserReview={true}
                                    onEdit={() =>
                                      setReviewingProductId(item.productId)
                                    }
                                  />
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setReviewingProductId(item.productId)
                                  }
                                  className="text-accent border-accent/30 hover:bg-accent/5"
                                >
                                  Add Review
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium text-foreground mb-2">
                        Shipping Address
                      </h4>
                      <div className="text-muted-foreground text-sm">
                        <p>{order.customerInfo.name}</p>
                        <p>{order.customerInfo.address.street}</p>
                        <p>
                          {order.customerInfo.address.city},{" "}
                          {order.customerInfo.address.state}{" "}
                          {order.customerInfo.address.zipCode}
                        </p>
                        <p>{order.customerInfo.address.country}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
