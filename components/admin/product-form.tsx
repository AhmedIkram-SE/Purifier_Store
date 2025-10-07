"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Product } from "@/models/Product"
import { X, Plus } from "lucide-react"

interface ProductFormProps {
  product?: Product
  onSubmit: (productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function ProductForm({ product, onSubmit, onCancel, loading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || ("water-purifier" as "water-purifier" | "air-purifier"),
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    imageURL: product?.imageURL || "",
    specifications: product?.specifications || {},
    features: product?.features || [],
  })
  const [newFeature, setNewFeature] = useState("")
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }))
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return { ...prev, specifications: newSpecs }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.description || formData.price <= 0) {
      setError("Please fill in all required fields")
      return
    }

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || "Failed to save product")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="water-purifier">Water Purifier</SelectItem>
                  <SelectItem value="air-purifier">Air Purifier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageURL">Image URL</Label>
            <Input
              id="imageURL"
              type="url"
              value={formData.imageURL}
              onChange={(e) => handleInputChange("imageURL", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Features */}
          <div className="space-y-4">
            <Label>Features</Label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={feature} readOnly className="flex-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <Label>Specifications</Label>
            <div className="space-y-2">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Input value={key} readOnly className="flex-1" />
                  <Input value={value} readOnly className="flex-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSpecification(key)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Specification name"
                  className="flex-1"
                />
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Specification value"
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
