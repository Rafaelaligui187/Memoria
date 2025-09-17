import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip middleware for admin login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Check for auth token in cookies or headers
    const authToken = request.cookies.get("auth_token")?.value

    // If no auth token, redirect to home with unauthorized message
    if (!authToken || authToken !== "admin_token") {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      url.searchParams.set("unauthorized", "true")
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
