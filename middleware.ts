import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
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

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  runtime: "nodejs", // ✅ force Node runtime to avoid EvalError
}
