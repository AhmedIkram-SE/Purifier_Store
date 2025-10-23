"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Wind, Shield, Award, Users, Heart } from "lucide-react"
import type { Content } from "@/models/Content"

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      const response = await fetch("/api/content/about")
      if (response.ok) {
        const data = await response.json()
        setAboutContent(data)
      }
    } catch (error) {
      console.error("Error fetching about content:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 text-balance">
            {aboutContent?.title || "About PureLife"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            {aboutContent?.description ||
              "We're dedicated to providing premium water and air purification solutions that create healthier environments for families worldwide."}
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Mission & Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on a foundation of quality, innovation, and customer care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <Heart className="h-16 w-16 text-accent mx-auto mb-6" />
                <h3 className="text-xl font-bold text-foreground mb-4">Health First</h3>
                <p className="text-muted-foreground">
                  We believe everyone deserves access to clean air and pure water. Our products are designed with your
                  family's health as the top priority.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Shield className="h-16 w-16 text-accent mx-auto mb-6" />
                <h3 className="text-xl font-bold text-foreground mb-4">Quality Assurance</h3>
                <p className="text-muted-foreground">
                  Every product undergoes rigorous testing and meets the highest industry standards. We stand behind our
                  quality with comprehensive warranties.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Users className="h-16 w-16 text-accent mx-auto mb-6" />
                <h3 className="text-xl font-bold text-foreground mb-4">Customer Care</h3>
                <p className="text-muted-foreground">
                  Our dedicated support team provides expert guidance and 24/7 assistance to ensure you get the most
                  from your purification systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2015, PureLife began with a simple mission: to make clean air and pure water accessible to
                  every household. What started as a small family business has grown into a trusted name in home
                  purification systems.
                </p>
                <p>
                  Our founders, driven by personal experiences with water contamination and air quality issues,
                  dedicated themselves to researching and developing the most effective purification technologies
                  available.
                </p>
                <p>
                  Today, we serve thousands of families across the country, providing not just products, but peace of
                  mind knowing that their home environment is clean, safe, and healthy.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">50,000+</div>
                    <div className="text-muted-foreground text-sm">Happy Customers</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-muted-foreground text-sm">Filtration Efficiency</div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4 mt-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">8+</div>
                    <div className="text-muted-foreground text-sm">Years Experience</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-muted-foreground text-sm">Customer Support</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive purification solutions for every aspect of your home environment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Droplets className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Water Purifiers</h3>
                    <Badge variant="secondary" className="mt-1">
                      Advanced Filtration
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  State-of-the-art water purification systems that remove contaminants, bacteria, and impurities while
                  retaining essential minerals for great-tasting, healthy water.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Multi-stage filtration technology</li>
                  <li>• Removes 99.9% of contaminants</li>
                  <li>• Retains beneficial minerals</li>
                  <li>• Easy maintenance and filter replacement</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Wind className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Air Purifiers</h3>
                    <Badge variant="secondary" className="mt-1">
                      HEPA Technology
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Professional-grade air purification systems featuring HEPA filtration and advanced technologies to
                  remove allergens, pollutants, and airborne particles.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• True HEPA filtration system</li>
                  <li>• Removes allergens and pollutants</li>
                  <li>• Quiet operation technology</li>
                  <li>• Smart air quality monitoring</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications & Awards */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Certifications & Recognition</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our commitment to quality is recognized by industry leaders and certification bodies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">NSF Certified</h4>
              <p className="text-sm text-muted-foreground">International health & safety standards</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">EPA Approved</h4>
              <p className="text-sm text-muted-foreground">Environmental protection standards</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Energy Star</h4>
              <p className="text-sm text-muted-foreground">Energy efficient products</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Customer Choice</h4>
              <p className="text-sm text-muted-foreground">Top rated by customers</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
