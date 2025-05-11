import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isOnPublicPage = req.nextUrl.pathname === "/";
  const isOnProtectedRoute =
    req.nextUrl.pathname.startsWith("/notes") ||
    req.nextUrl.pathname.startsWith("/todos") ||
    req.nextUrl.pathname.startsWith("/sketch");

  // Allow access to public pages and auth-related pages
  if (isOnPublicPage || isOnAuthPage) {
    return NextResponse.next();
  }

  // Redirect to home page with signin modal if trying to access protected routes while not logged in
  if (isOnProtectedRoute && !isLoggedIn) {
    const url = new URL("/", req.url);
    url.searchParams.set("notloggedin", "true");
    return NextResponse.redirect(url);
  }

  // For all other routes, proceed normally
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
