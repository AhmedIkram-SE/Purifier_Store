"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    query: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage("Thank you for your message! We'll get back to you within 24 hours.")
        setFormData({
          name: "",
          email: "",
          phone: "",
          query: "",
        })
      } else {
        const data = await response.json()
        setError(data.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      setError("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 text-balance">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Have questions about our products or need support? We're here to help you find the perfect purification
            solution for your home.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Company Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">Get in Touch</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  At PureLife, we're committed to providing exceptional customer service and support. Whether you need
                  product information, technical assistance, or have questions about your order, our team of experts is
                  ready to help.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Phone className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
                        <p className="text-muted-foreground mb-1">+1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                        <p className="text-sm text-muted-foreground">Saturday - Sunday: 9:00 AM - 5:00 PM EST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Mail className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                        <p className="text-muted-foreground mb-1">info@purelife.com</p>
                        <p className="text-sm text-muted-foreground">We typically respond within 2-4 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Office Address</h3>
                        <p className="text-muted-foreground">123 Clean St</p>
                        <p className="text-muted-foreground">Pure City, PC 12345</p>
                        <p className="text-muted-foreground">United States</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Clock className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                        <div className="space-y-1 text-muted-foreground">
                          <p>Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                          <p>Saturday: 9:00 AM - 5:00 PM EST</p>
                          <p>Sunday: 10:00 AM - 4:00 PM EST</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Information */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">Need Immediate Help?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  For urgent technical support or product issues, please call our dedicated support line. Our technical
                  experts are available to help you troubleshoot and resolve any problems quickly.
                </p>
                <div className="flex items-center gap-2 text-accent">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Live Chat Available 24/7</span>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
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

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number (optional)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="query">Your Message *</Label>
                      <Textarea
                        id="query"
                        name="query"
                        value={formData.query}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? "Sending..." : "Send Message"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our privacy policy. We'll only use your information to
                      respond to your inquiry.
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">How long does shipping take?</h4>
                      <p className="text-sm text-muted-foreground">
                        Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">What's included in the warranty?</h4>
                      <p className="text-sm text-muted-foreground">
                        All products come with a 2-year comprehensive warranty covering parts and labor.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Do you offer installation services?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes, we provide professional installation services in most areas. Contact us for availability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
