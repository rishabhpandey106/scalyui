import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for common token cookie names since the specific name wasn't provided, 
  // 'scaly_token' is what we used before, 'token' or 'access_token' are common defaults.
  const token = 
    request.cookies.get('scaly_token')?.value || 
    request.cookies.get('token')?.value || 
    request.cookies.get('access_token')?.value;

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (isAuthPage) {
    if (token) {
      // Redirect logged-in users away from auth pages instantly
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (isDashboardRoute) {
    if (!token) {
      // Redirect unauthenticated users to login instantly
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * But we only care about dashboard, login, and signup.
     */
    '/dashboard/:path*', 
    '/login', 
    '/signup'
  ],
};
