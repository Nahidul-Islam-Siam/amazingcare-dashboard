/* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req: NextRequest) {
//   const { cookies, nextUrl } = req;
//   const accessToken = cookies.get("access_token")?.value;

//   // If no token, redirect to login
//   if (!accessToken) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   try {
//     // decode token (no signature verification)
//     const decoded = jwt.decode(accessToken) as any;

//     const role = decoded?.role?.toUpperCase() || "";

//     // Example: Protect /dashboard for ADMIN only
//     if (nextUrl.pathname.startsWith("/dashboard") && role !== "ADMIN" && role !== "MANAGER") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     // You can add more protected routes/role checks here

//     // If everything is fine, continue
//     return NextResponse.next();
//   } catch (err) {
//     console.error("JWT decode error:", err);
//     return NextResponse.redirect(new URL("/", req.url));
//   }
// }

// // Apply middleware only to protected routes
// export const config = {
//   matcher: ["/dashboard/:path*"],
// };




/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // 🔓 TEMPORARY: Bypass authentication and authorization
  // You can re-enable this when accessToken is available
  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*"],
};