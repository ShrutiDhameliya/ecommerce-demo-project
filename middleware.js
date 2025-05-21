import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isShopRoute = req.nextUrl.pathname.startsWith('/shop');

  // Handle auth pages
  if (isAuthPage) {
    if (isAuth) {
      // Redirect to appropriate page based on role
      if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      } else {
        return NextResponse.redirect(new URL('/shop', req.url));
      }
    }
    return null;
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/shop', req.url));
    }
    return null;
  }

  // Handle shop routes
  if (isShopRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return null;
  }

  return null;
}

export const config = {
  matcher: ['/admin/:path*', '/shop/:path*', '/auth/:path*']
}; 