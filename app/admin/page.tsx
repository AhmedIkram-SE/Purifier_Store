"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductForm from "@/components/admin/product-form"
import OrderManagement from "@/components/admin/order-management"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import type { Product } from "@/models/Product"
import type { Order } from "@/models/Order"
import { Package, ShoppingCart, Users, DollarSign, Plus, Edit, Trash2, BarChart3, ClipboardList } from "lucide-react"

interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState("")
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== "admin") {
        router.push("/")
        return
      }
      fetchData()
    }
  }, [isAuthenticated, user, authLoading, router])

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, statsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/admin/stats"),
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async (productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) => {
    setFormLoading(true)
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        setShowProductForm(false)
        fetchData()
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to create product")
      }
    } catch (error: any) {
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateProduct = async (productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) => {
    if (!editingProduct) return

    setFormLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        setEditingProduct(null)
        fetchData()
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to update product")
      }
    } catch (error: any) {
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete product")
      }
    } catch (error) {
      setError("Failed to delete product")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (showProductForm || editingProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={() => {
              setShowProductForm(false)
              setEditingProduct(null)
            }}
            loading={formLoading}
          />
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
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store products, orders, and view analytics</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-primary">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Product Management
                  </CardTitle>
                  <Button onClick={() => setShowProductForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No products found. Add your first product to get started.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {products.map((product) => (
                        <div key={product._id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={product.imageURL || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {product.category === "water-purifier" ? "Water Purifier" : "Air Purifier"}
                              </Badge>
                              <span className="text-muted-foreground text-sm">Stock: {product.stock}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product._id!)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderManagement orders={orders} onOrderUpdate={fetchData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
