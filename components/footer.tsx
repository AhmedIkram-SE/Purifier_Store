import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-muted mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                {/* <span className="text-primary-foreground font-bold text-lg">P</span> */}
                <Image
                  src="/favicon.ico"
                  alt="Purelife logo"
                  height={35}
                  width={35}
                  className="object-contian"
                />
              </div>
              <span className="text-xl font-bold text-primary">PureLife</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Premium water and air purifiers for a healthier home. Clean air
              and pure water for your family.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                All Products
              </Link>
              <Link
                href="/products?category=water-purifier"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Water Purifiers
              </Link>
              <Link
                href="/products?category=air-purifier"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Air Purifiers
              </Link>
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Customer Service</h3>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link
                href="/shipping-info"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Returns
              </Link>
              <Link
                href="/warranty"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Warranty
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  info@purelife.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  123 Clean St, Pure City, PC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 PureLife. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
