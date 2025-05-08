import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the user token from cookies
  const userCookie = request.cookies.get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  // Protect dashboard and game pages
  if ((pathname === "/" || pathname.startsWith("/games/")) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged in users from login page to dashboard
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/games/:path*"],
};
