import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isOnPublicPage = req.nextUrl.pathname === "/";

  // Allow access to public pages and auth-related pages
  if (isOnPublicPage || isOnAuthPage) {
    return NextResponse.next();
  }

  // For protected routes, just let the client handle the auth state
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
