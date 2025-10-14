"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogoutButton } from "./logout-button"

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">Memoria</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="text-sm font-medium hover:text-blue-600">
            {isAuthenticated ? "Dashboard" : "Home"}
          </Link>
          <Link href="/gallery" className="text-sm font-medium hover:text-blue-600">
            Gallery
          </Link>
          <Link href="/faculty" className="text-sm font-medium hover:text-blue-600">
            Faculty & Staff
          </Link>
          <Link href="/school-history" className="text-sm font-medium hover:text-blue-600">
            School History
          </Link>
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2 border-l pl-4 ml-2">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold">
                  {user.initials || "U"}
                </div>
                <span className="text-sm font-medium">{user.name || "User"}</span>
              </div>
              <LogoutButton />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-white">
          <nav className="flex flex-col space-y-4">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="text-sm font-medium hover:text-blue-600">
              {isAuthenticated ? "Dashboard" : "Home"}
            </Link>
            <Link href="/gallery" className="text-sm font-medium hover:text-blue-600">
              Gallery
            </Link>
            <Link href="/faculty" className="text-sm font-medium hover:text-blue-600">
              Faculty & Staff
            </Link>
            <Link href="/school-history" className="text-sm font-medium hover:text-blue-600">
              School History
            </Link>
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 py-2 border-t">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold">
                    {user.initials || "U"}
                  </div>
                  <span className="text-sm font-medium">{user.name || "User"}</span>
                </div>
                <LogoutButton className="w-full" />
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
