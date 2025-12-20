import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log(request.nextUrl,"bla bla")
  if (request.nextUrl.pathname.startsWith('/.well-known')) {
    return new NextResponse(null, { status: 404 })
  }
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.*\\.xml).*)",
    "/:path*",
  ],
};
