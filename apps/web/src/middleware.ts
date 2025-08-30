import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
} from './constants/env';

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
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE_KEY)?.value;
  const { pathname, search, basePath, origin } = req.nextUrl;
  const isAction = req.method === 'POST' && req.headers.has('Next-Action');

  if (isAction) {
    return NextResponse.next();
  }

  if (!accessToken && !!refreshToken) {
    const refreshRes = await fetch(new URL(`/api/auth/refresh`, origin), {
      method: 'POST',
      headers: { Cookie: req.headers.get('cookie') ?? '' },
      credentials: 'include',
    });

    const res = NextResponse.redirect(req.nextUrl);
    if (refreshRes.ok) {
      res.headers.set('set-cookie', refreshRes.headers.get('set-cookie') ?? '');
    } else {
      res.cookies.delete(REFRESH_TOKEN_COOKIE_KEY);
    }
    return res;
  }

  if (isProtectedPath(pathname) && !accessToken) {
    const redirectUrl = new URL(`/login`, origin);
    redirectUrl.searchParams.set('from', `${basePath}${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  } else if (isGuestOnlyPath(pathname) && !!accessToken) {
    return NextResponse.redirect(new URL('/projects', origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
