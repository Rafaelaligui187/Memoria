"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { UserMenu } from "./user-menu"

export function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* Brand */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2 text-lg font-bold select-none cursor-default">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">Memoria</span>
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">Memoria</span>
          </Link>
        )}

        {/* Nav links */}
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            {isAuthenticated ? "Dashboard" : "Home"}
          </Link>
          <Link
            href="/gallery"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            Gallery
          </Link>
          <Link
            href="/faculty"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            Faculty &#38; Staff
          </Link>
          <Link
            href="/school-history"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            School History
          </Link>
        </nav>

        {/* Auth buttons / User Menu */}
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 border border-transparent hover:border-blue-200"
            >
              Sign&nbsp;In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all duration-200"
            >
              Sign&nbsp;Up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
