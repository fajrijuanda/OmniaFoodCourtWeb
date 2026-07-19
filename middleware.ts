import { NextResponse, type NextRequest } from "next/server";

function isAllowedPath(pathname: string) {
  return pathname === "/" || pathname === "/login" || pathname === "/register" || pathname.startsWith("/oauth/")
    || pathname.startsWith("/menu/")
    || pathname.startsWith("/portal/fnb")
    || pathname.startsWith("/portal/food-and-beverage")
    || pathname.startsWith("/portal/fb-kuliner")
    || pathname.startsWith("/portal/notifications")
    || pathname.startsWith("/portal/profile");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/portal") {
    return NextResponse.redirect(new URL("/portal/fnb/cafe", request.url));
  }
  if (pathname.startsWith("/portal/") && !isAllowedPath(pathname)) {
    return NextResponse.redirect(new URL("/portal/fnb/cafe", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
