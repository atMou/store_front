"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Headphones,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Shield,
  Truck,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { HeaderLogo } from "./header";



const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-b border-gray-200"
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">
                Free Shipping
              </h4>
              <p className="text-sm text-gray-600">On orders over 29.5€</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">
                Secure Payment
              </h4>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
              <Headphones className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">
                24/7 Support
              </h4>
              <p className="text-sm text-gray-600">Dedicated support team</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Logo and description */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="col-span-1"
          >
            <HeaderLogo />

            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              Your trusted destination for quality products and exceptional
              service.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="text-gray-500 mt-0.5 shrink-0"
                />
                <p className="text-sm text-gray-600">
                 11016 Berlin, Germany 
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500 shrink-0" />
                <p className="text-sm text-gray-600">+49 30 1234567</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500 shrink-0" />
                <p className="text-sm text-gray-600">support@fakelando.com</p>
              </div>
            </div>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Follow Us
            </h3>
            <div className="flex gap-2 mb-6">
              {[
                {
                  icon: <Facebook size={16} />,
                  name: "Facebook",
                  href: "https://facebook.com",
                },
                {
                  icon: <Twitter size={16} />,
                  name: "Twitter",
                  href: "https://twitter.com",
                },
                {
                  icon: <Instagram size={16} />,
                  name: "Instagram",
                  href: "https://instagram.com",
                },
                {
                  icon: <Youtube size={16} />,
                  name: "YouTube",
                  href: "https://youtube.com",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-800 hover:text-white rounded-full flex items-center justify-center text-gray-600 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Payment Methods
              </h4>
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">
                  Visa
                </span>
                <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">
                  Mastercard
                </span>
                <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">
                  Stripe
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="border-t border-gray-200 py-6 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-gray-600">
            © {currentYear} FakeLando. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            {[
              { name: "Terms", href: "/terms" },
              { name: "Privacy", href: "/privacy" },
              { name: "Cookies", href: "/cookies" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
