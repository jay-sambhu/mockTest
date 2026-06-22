import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";

function isProtectedPath(pathname: string) {
  if (pathname === "/quizzes/new" || pathname.startsWith("/quizzes/new/")) {
    return true;
  }

  if (pathname === "/attempts" || pathname.startsWith("/attempts/")) {
    return true;
  }

  return /^\/quizzes\/\d+\/edit\/?$/.test(pathname);
}

export function middleware(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/quizzes/new", "/quizzes/:id/edit", "/attempts"],
};
