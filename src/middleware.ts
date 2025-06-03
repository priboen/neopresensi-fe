import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const AUTH_TOKEN_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME;
const JWT_SECRET_STRING = process.env.JWT_SECRET;

const getJwtSecretKey = () => {
  if (!JWT_SECRET_STRING) {
    throw new Error("Variabel lingkungan JWT_SECRET belum diatur.");
  }
  return new TextEncoder().encode(JWT_SECRET_STRING);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!AUTH_TOKEN_COOKIE_NAME) {
    console.error(
      "AUTH_TOKEN_COOKIE_NAME belum diatur di environment variables."
    );
    return NextResponse.redirect(
      new URL("/login?error=config_error", request.url)
    );
  }
  if (!JWT_SECRET_STRING) {
    console.error("JWT_SECRET belum diatur di environment variables.");
    return NextResponse.redirect(
      new URL("/login?error=config_error", request.url)
    );
  }

  const tokenCookie = request.cookies.get(AUTH_TOKEN_COOKIE_NAME);
  const token = tokenCookie?.value;

  const authPaths = ["/login", "/register", "/error/403"];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  let isAuthenticated = false;
  let userRole: string | null = null;

  if (token) {
    try {
      const secretKey = getJwtSecretKey();
      const { payload } = await jose.jwtVerify(token, secretKey);

      if (payload.role && typeof payload.role === "string") {
        userRole = payload.role.toLowerCase();
        isAuthenticated = true;
      } else {
        console.warn(
          'Klaim "role" tidak ditemukan atau bukan string dalam payload JWT.'
        );
      }
    } catch (err: any) {
      console.error("Verifikasi JWT gagal:", err.message);
      const loginUrl = new URL("/login?error=session_expired", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(AUTH_TOKEN_COOKIE_NAME);
      return response;
    }
  }

  if (pathname === "/error/403") {
    return NextResponse.next();
  }

  if (isAuthPath) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirectedFrom", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (userRole !== "admin") {
    console.log(
      `Pengguna dengan role '${userRole}' mencoba akses ${pathname}. Ditolak. Mengarahkan ke /403.`
    );

    const unauthorizedUrl = new URL("/error/403", request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  console.log(
    `Pengguna admin ('${userRole}') mengakses ${pathname}. Diizinkan.`
  );
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts|sw.js|manifest.json|robots.txt|sitemap.xml).*)",
  ],
};
