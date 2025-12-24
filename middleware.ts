import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Protect role-specific routes
export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "super-secret-secret",
  });
  const { pathname } = req.nextUrl;

  // Admin routes
  if (pathname.startsWith("/admin")) {
    // console.log("[Middleware] Debug Token:", JSON.stringify(token, null, 2)); // DEBUG
    if (!token || (token.role as string)?.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/?unauthorized=admin", req.url));
    }
  }

  // Seller routes
  if (pathname.startsWith("/seller")) {
    if (!token || (token.role as string) !== "seller") {
      return NextResponse.redirect(new URL("/?unauthorized=seller", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/seller/:path*"],
};



