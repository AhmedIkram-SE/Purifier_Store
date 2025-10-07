import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get("token")?.value

  const requiresAuth =
    pathname.startsWith("/orders") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin")

  if (requiresAuth && !token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("next", pathname + request.nextUrl.search)
    return NextResponse.redirect(url)
  }

  // Note: Role checks for admin are enforced server-side in API routes/pages
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*", "/profile/:path*", "/checkout"],
}
