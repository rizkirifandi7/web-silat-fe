
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple JWT decode (tanpa verifikasi signature, hanya untuk baca payload role)
interface JwtPayload {
  role?: string;
  [key: string]: unknown;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  const payload = parseJwt(token.value);
  if (!payload || !payload.role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proteksi role per route
  const url = request.nextUrl.pathname;
  if (url.startsWith('/dashboard') && !['admin', 'superadmin'].includes(payload.role)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (url.startsWith('/dashboard-anggota') && payload.role !== 'anggota') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard-anggota/:path*'],
};
