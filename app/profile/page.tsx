"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { User, CreditCard, MapPin, Mail, Phone, Edit, Save, X } from "lucide-react"

interface BillingInfo {
  cardholderName?: string
  billingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingBilling, setEditingBilling] = useState(false)
  const [savingBilling, setSavingBilling] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [billingForm, setBillingForm] = useState({
    cardholderName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (isAuthenticated) {
      fetchBillingInfo()
    }
  }, [isAuthenticated, authLoading, router])

  const fetchBillingInfo = async () => {
    try {
      const response = await fetch("/api/profile/billing")
      if (response.ok) {
        const data = await response.json()
        setBillingInfo(data.billingInfo)

        if (data.billingInfo) {
          setBillingForm({
            cardholderName: data.billingInfo.cardholderName || "",
            street: data.billingInfo.billingAddress?.street || "",
            city: data.billingInfo.billingAddress?.city || "",
            state: data.billingInfo.billingAddress?.state || "",
            zipCode: data.billingInfo.billingAddress?.zipCode || "",
            country: data.billingInfo.billingAddress?.country || "United States",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching billing info:", error)
      setError("Failed to load billing information")
    } finally {
      setLoading(false)
    }
  }

  const handleBillingFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingForm({
      ...billingForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleSaveBilling = async () => {
    setSavingBilling(true)
    setError("")
    setMessage("")

    try {
      const billingInfoToSave = {
        cardholderName: billingForm.cardholderName,
        billingAddress: {
          street: billingForm.street,
          city: billingForm.city,
          state: billingForm.state,
          zipCode: billingForm.zipCode,
          country: billingForm.country,
        },
      }

      const response = await fetch("/api/profile/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingInfo: billingInfoToSave }),
      })

      if (response.ok) {
        setBillingInfo(billingInfoToSave)
        setEditingBilling(false)
        setMessage("Billing information updated successfully")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update billing information")
      }
    } catch (error) {
      setError("Failed to update billing information")
    } finally {
      setSavingBilling(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingBilling(false)
    setError("")
    setMessage("")

    // Reset form to current billing info
    if (billingInfo) {
      setBillingForm({
        cardholderName: billingInfo.cardholderName || "",
        street: billingInfo.billingAddress?.street || "",
        city: billingInfo.billingAddress?.city || "",
        state: billingInfo.billingAddress?.state || "",
        zipCode: billingInfo.billingAddress?.zipCode || "",
        country: billingInfo.billingAddress?.country || "United States",
      })
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <p className="text-foreground font-medium">{user.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Account Type</Label>
                <p className="text-foreground font-medium capitalize">{user.role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing Information
                </CardTitle>
                {!editingBilling && (
                  <Button variant="outline" size="sm" onClick={() => setEditingBilling(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {billingInfo ? "Edit" : "Add"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingBilling ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      name="cardholderName"
                      value={billingForm.cardholderName}
                      onChange={handleBillingFormChange}
                      placeholder="Enter cardholder name"
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Billing Address</Label>
                  </div>

                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      value={billingForm.street}
                      onChange={handleBillingFormChange}
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={billingForm.city}
                        onChange={handleBillingFormChange}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={billingForm.state}
                        onChange={handleBillingFormChange}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={billingForm.zipCode}
                        onChange={handleBillingFormChange}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <Button onClick={handleSaveBilling} disabled={savingBilling} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {savingBilling ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} disabled={savingBilling} size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : billingInfo ? (
                <div className="space-y-4">
                  {billingInfo.cardholderName && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Cardholder Name</Label>
                      <p className="text-foreground font-medium">{billingInfo.cardholderName}</p>
                    </div>
                  )}

                  {billingInfo.billingAddress && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Billing Address</Label>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="text-foreground">
                          <p>{billingInfo.billingAddress.street}</p>
                          <p>
                            {billingInfo.billingAddress.city}, {billingInfo.billingAddress.state}{" "}
                            {billingInfo.billingAddress.zipCode}
                          </p>
                          <p>{billingInfo.billingAddress.country}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No billing information saved</p>
                  <p className="text-sm text-muted-foreground">
                    Add your billing information to speed up future checkouts
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={() => router.push("/orders")} className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  View My Orders
                </Button>
                <Button variant="outline" onClick={() => router.push("/products")} className="flex items-center gap-2">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
