import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_KEY } from './constants/env';

const protectedPaths = ['/projects', '/profile'];
const guestOnlyRoutes = ['/login', '/register'];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((p) => pathname.startsWith(p));
}

function isGuestOnlyPath(pathname: string) {
  return guestOnlyRoutes.some((p) => pathname === p);
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  if (isProtectedPath(req.nextUrl.pathname) && !accessToken) {
    const refreshRes = await fetch(new URL(`/api/auth/refresh`, req.url), {
      method: 'POST',
      headers: { Cookie: req.headers.get('cookie') ?? '' },
      credentials: 'include',
    });

    if (!refreshRes.ok) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.redirect(req.nextUrl, {
      headers: {
        'set-cookie': refreshRes.headers.get('set-cookie') || '',
      },
    });
  } else if (isGuestOnlyPath(req.nextUrl.pathname) && !!accessToken) {
    return NextResponse.redirect(new URL('/projects', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
