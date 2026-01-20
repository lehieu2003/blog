import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedPaths = ['/write', '/posts/me', '/posts/edit', '/admin'];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // Admin-only routes
  const isAdminPath = pathname.startsWith('/admin');

  // Redirect to signin if accessing protected route without auth
  if (isProtectedPath && !token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to home if non-admin tries to access admin routes
  if (isAdminPath && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to home if already logged in and trying to access signin
  if (pathname === '/auth/signin' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/write',
    '/posts/me',
    '/posts/edit/:path*',
    '/admin/:path*',
    '/auth/signin',
  ],
};
