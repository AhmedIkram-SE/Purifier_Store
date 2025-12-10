"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/models/Product";
import { X, Plus, Sparkles, Loader } from "lucide-react";
import { useAIEnhance } from "@/hooks/use-ai-enhance";

function generateSlug(name: string, category: string) {
  // Convert category to readable format
  const categorySlug = category.replace(/-/g, " ");

  // Combine category and name
  const fullText = `${categorySlug} ${name}`;

  return fullText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (
    productData: Omit<Product, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  loading,
}: ProductFormProps) {
  const { enhance, loading: aiLoading, error: aiError } = useAIEnhance();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    category:
      product?.category ||
      ("water-purifier" as "water-purifier" | "air-purifier"),
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    inStock: product?.stock ? product.stock > 0 : true,
    imageURL: product?.imageURL || "",
    keywords: product?.keywords || [],
    specifications: product?.specifications || {},
    features: product?.features || [],
  });
  const [newFeature, setNewFeature] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [error, setError] = useState("");
  const [aiMessageDescription, setAiMessageDescription] = useState<
    string | null
  >(null);
  const [aiMessageKeywords, setAiMessageKeywords] = useState<string | null>(
    null
  );

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const addKeyword = (keyword: string) => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    if (trimmedKeyword && !formData.keywords.includes(trimmedKeyword)) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, trimmedKeyword],
      }));
    }
  };

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;

    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      if (value.trim()) {
        addKeyword(value);
        setKeywordInput("");
      }
    }
  };

  const handleEnhanceDescription = async () => {
    if (!formData.name || !formData.category || !formData.description) {
      setAiMessageDescription(
        "Please fill in Product Name, Category, and Description first"
      );
      return;
    }

    const enhanced = await enhance(
      formData.name,
      formData.category,
      formData.description,
      "description"
    );

    if (enhanced) {
      handleInputChange("description", enhanced);
      setAiMessageDescription(
        "✓ Description enhanced! Review and adjust as needed."
      );
    } else {
      setAiMessageDescription(
        "Failed to enhance description. Check your API key."
      );
    }
  };

  const handleEnhanceKeywords = async () => {
    if (!formData.name || !formData.category || !formData.description) {
      setAiMessageKeywords(
        "Please fill in Product Name, Category, and Description first"
      );
      return;
    }

    const enhanced = await enhance(
      formData.name,
      formData.category,
      formData.description,
      "keywords"
    );

    if (enhanced) {
      // Parse keywords and add them
      const keywords = enhanced
        .split(",")
        .map((kw) => kw.trim().toLowerCase())
        .filter((kw) => kw && !formData.keywords.includes(kw));

      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, ...keywords],
      }));
      setAiMessageKeywords(
        "✓ Keywords added! Review and remove any you don't want."
      );
    } else {
      setAiMessageKeywords("Failed to generate keywords. Check your API key.");
    }
  };

  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Auto-add keyword when comma is typed
    if (value.includes(",")) {
      const keywords = value.split(",");
      const lastKeyword = keywords.pop() || "";

      keywords.forEach((keyword) => {
        if (keyword.trim()) {
          addKeyword(keyword);
        }
      });

      setKeywordInput(lastKeyword);
    } else {
      setKeywordInput(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.description || formData.price <= 0) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const slug = generateSlug(formData.name, formData.category);
      await onSubmit({ ...formData, slug });
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    }
  };

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
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
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
                onChange={(e) =>
                  handleInputChange(
                    "price",
                    Number.parseFloat(e.target.value) || 0
                  )
                }
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
                onChange={(e) =>
                  handleInputChange(
                    "stock",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inStock">Availability *</Label>
              <Select
                value={formData.inStock ? "true" : "false"}
                onValueChange={(value) =>
                  handleInputChange("inStock", value === "true")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">In Stock</SelectItem>
                  <SelectItem value="false">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageURL">Image URL</Label>
            <Input
              id="imageURL"
              type="string"
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEnhanceDescription}
              disabled={aiLoading || !formData.name || !formData.category}
              className="gap-2 mt-2"
            >
              {aiLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  AI Enhance Description
                </>
              )}
            </Button>
            {aiMessageDescription && (
              <Alert
                variant={
                  aiMessageDescription.startsWith("✓")
                    ? "default"
                    : "destructive"
                }
              >
                <AlertDescription>{aiMessageDescription}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Keywords */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (for SEO)</Label>
              <p className="text-sm text-muted-foreground">
                Enter keywords separated by commas or press Enter to add. These
                will be used for SEO metadata.
              </p>

              {/* Display existing keywords as badges */}
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                  {formData.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => removeKeyword(index)}
                    >
                      {keyword}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Keyword input */}
              <Input
                id="keywords"
                value={keywordInput}
                onChange={handleKeywordInputChange}
                onKeyDown={handleKeywordInput}
                placeholder="Type keywords and press Enter or use commas to separate (e.g., water filter, purification, clean water)"
                className="w-full"
              />

              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleEnhanceKeywords}
                  disabled={aiLoading || !formData.name || !formData.category}
                  className="gap-2 mt-2"
                >
                  {aiLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      AI Generate Keywords
                    </>
                  )}
                </Button>
              </div>

              {aiMessageKeywords && (
                <Alert
                  variant={
                    aiMessageKeywords.startsWith("✓")
                      ? "default"
                      : "destructive"
                  }
                >
                  <AlertDescription>{aiMessageKeywords}</AlertDescription>
                </Alert>
              )}

              <div className="text-xs text-muted-foreground">
                💡 Tip: Type keywords and press Enter, Tab, or use commas to add
                them as tags. Click on any tag to remove it.
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <Label>Features</Label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={feature} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpecification(key)}
                  >
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpecification}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Create Product"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
