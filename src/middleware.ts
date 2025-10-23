/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { cookies, nextUrl } = req;
  const token = cookies.get("token")?.value; // ✅ consistent with your login Cookies.set("token", ...)

  // 🚫 No token: redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // ✅ Decode token safely (no verification since we just need claims)
    const decoded = jwt.decode(token) as any;

    if (!decoded || !decoded.role) {
      console.warn("Invalid token: missing role");
      return NextResponse.redirect(new URL("/", req.url));
    }

    const role = decoded.role.toUpperCase();
    const path = nextUrl.pathname;

    // ✅ Role-based access rules
    const roleAccessMap: Record<string, string[]> = {
      "/admin": ["ADMIN", "SUPER_ADMIN"],
      "/dashboard": ["TEACHER"],
    };

    for (const routePrefix in roleAccessMap) {
      if (path.startsWith(routePrefix)) {
        const allowedRoles = roleAccessMap[routePrefix];
        if (!allowedRoles.includes(role)) {
          console.warn(`Access denied for role ${role} to ${routePrefix}`);
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }

    // ✅ All good → continue
    return NextResponse.next();
  } catch (error) {
    console.error("JWT decode error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// ✅ Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"], // You can add more protected paths here
};
