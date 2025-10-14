"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Footer() {
  const { isAuthenticated } = useAuth()

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          {/* Logo & Description */}
          <div className="md:w-1/4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold text-blue-600">Memoria</span>
            </div>
            <p className="text-gray-400 text-sm">
              Consolatrix College of Toledo City, Inc. Digital Yearbook – Preserving memories that last a lifetime.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/2">
            <h3 className="font-semibold text-gray-200 mb-3">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-4">
              <li>
                <Link
                  href={isAuthenticated ? "/dashboard" : "/"}
                  className="block w-full text-center px-4 py-2 bg-gray-800 rounded-lg text-white text-sm font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {isAuthenticated ? "Dashboard" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="block w-full text-center px-4 py-2 bg-gray-800 rounded-lg text-white text-sm font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/faculty"
                  className="block w-full text-center px-4 py-2 bg-gray-800 rounded-lg text-white text-sm font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Faculty & Staff
                </Link>
              </li>
              <li>
                <Link
                  href="/school-history"
                  className="block w-full text-center px-4 py-2 bg-gray-800 rounded-lg text-white text-sm font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  School History
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:w-1/4 flex flex-col items-start">
            <h3 className="font-semibold text-gray-200 mb-3">Contact</h3>
            <address className="not-italic text-gray-400 text-sm space-y-1 text-left">
              <p>Consolatrix College of Toledo City, Inc.</p>
              <p>Toledo City</p>
              <p>Email: info@consolatrix.edu.ph</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Memoria - Consolatrix College of Toledo City, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
