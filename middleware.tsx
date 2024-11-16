import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const sessionToken = req.cookies.get("auth-token");

  if ((!sessionToken || !sessionToken.value) && path !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (sessionToken) {
    return NextResponse.redirect(new URL("/dashboard/products", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
