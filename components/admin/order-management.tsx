"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Order } from "@/models/Order";
import {
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  Eye,
  CheckCircle,
} from "lucide-react";

interface OrderManagementProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

export default function OrderManagement({
  orders,
  onOrderUpdate,
}: OrderManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        onOrderUpdate();
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const order = await response.json();
        setSelectedOrder(order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No orders found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-4 sm:p-6">
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-4">
                  {/* Header with Order ID and Status */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground text-sm">
                        Order #{order._id?.slice(-8)}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Reviews Enabled Badge */}
                    {order.status === "delivered" && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 border-green-200 w-fit"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Reviews Enabled
                      </Badge>
                    )}
                  </div>

                  {/* Order Info - Stacked */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(order.createdAt!.toString())}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {order.customerInfo.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium text-foreground">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Status:
                      </span>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order._id!, value)
                        }
                        disabled={updating === order._id}
                      >
                        <SelectTrigger className="flex-1 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* View Details Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => fetchOrderDetails(order._id!)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Order Details #{order._id?.slice(-8)}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Customer Information */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">
                                Customer Information
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {selectedOrder.customerInfo.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {selectedOrder.customerInfo.email}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                  <div className="text-sm text-muted-foreground">
                                    <p>
                                      {
                                        selectedOrder.customerInfo.address
                                          .street
                                      }
                                    </p>
                                    <p>
                                      {selectedOrder.customerInfo.address.city},{" "}
                                      {selectedOrder.customerInfo.address.state}{" "}
                                      {
                                        selectedOrder.customerInfo.address
                                          .zipCode
                                      }
                                    </p>
                                    <p>
                                      {
                                        selectedOrder.customerInfo.address
                                          .country
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {selectedOrder.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-3 p-3 border border-border rounded-lg"
                                  >
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                      <Image
                                        src={
                                          item.imageURL || "/placeholder.svg"
                                        }
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded-md"
                                      />
                                    </div>
                                    <div className="flex-grow">
                                      <h5 className="font-medium text-foreground text-sm">
                                        {item.name}
                                      </h5>
                                      <p className="text-xs text-muted-foreground">
                                        Quantity: {item.quantity}
                                      </p>
                                      <p className="text-sm font-medium text-foreground">
                                        {formatPrice(item.price)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-border pt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-foreground">
                                  Total:
                                </span>
                                <span className="font-bold text-lg text-foreground">
                                  {formatPrice(selectedOrder.totalPrice)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Order #{order._id?.slice(-8)}
                      </h3>
                      <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.createdAt!.toString())}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{order.customerInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          <span>{formatPrice(order.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                      {order.status === "delivered" && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 border-green-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Reviews Enabled
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order._id!, value)
                        }
                        disabled={updating === order._id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchOrderDetails(order._id!)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Order Details #{order._id?.slice(-8)}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Customer Information */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">
                                Customer Information
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {selectedOrder.customerInfo.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {selectedOrder.customerInfo.email}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                  <div className="text-sm text-muted-foreground">
                                    <p>
                                      {
                                        selectedOrder.customerInfo.address
                                          .street
                                      }
                                    </p>
                                    <p>
                                      {selectedOrder.customerInfo.address.city},{" "}
                                      {selectedOrder.customerInfo.address.state}{" "}
                                      {
                                        selectedOrder.customerInfo.address
                                          .zipCode
                                      }
                                    </p>
                                    <p>
                                      {
                                        selectedOrder.customerInfo.address
                                          .country
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {selectedOrder.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-3 p-3 border border-border rounded-lg"
                                  >
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                      <Image
                                        src={
                                          item.imageURL || "/placeholder.svg"
                                        }
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded-md"
                                      />
                                    </div>
                                    <div className="flex-grow">
                                      <h5 className="font-medium text-foreground text-sm">
                                        {item.name}
                                      </h5>
                                      <p className="text-xs text-muted-foreground">
                                        Quantity: {item.quantity}
                                      </p>
                                      <p className="text-sm font-medium text-foreground">
                                        {formatPrice(item.price)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-border pt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-foreground">
                                  Total:
                                </span>
                                <span className="font-bold text-lg text-foreground">
                                  {formatPrice(selectedOrder.totalPrice)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
