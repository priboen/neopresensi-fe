import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const AUTH_TOKEN_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!AUTH_TOKEN_COOKIE_NAME) {
    console.error(
      "AUTH_TOKEN_COOKIE_NAME tidak terdefinisi di environment variables untuk middleware."
    );
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get(AUTH_TOKEN_COOKIE_NAME);

  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthenticated) {
    if (isAuthPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (!isAuthPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts|sw.js|manifest.json|robots.txt|sitemap.xml).*)",
  ],
};
