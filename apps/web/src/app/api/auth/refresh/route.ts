import { NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_KEY, API_BASE_URL } from '@/constants/env';

export async function POST(request: NextRequest) {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: request.cookies.toString(),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      {
        errors: Array.isArray(data.message)
          ? data.message
          : [data.message || 'Refresh failed'],
      },
      {
        status: res.status,
        headers: {
          'set-cookie': res.headers.get('set-cookie') || '',
        },
      }
    );
  }

  const nextRes = NextResponse.json(data.user, {
    status: res.status,
    headers: {
      'set-cookie': res.headers.get('set-cookie') || '',
    },
  });

  nextRes.cookies.set({
    name: ACCESS_TOKEN_COOKIE_KEY,
    value: data.accessToken,
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: Number(data.expiresIn),
  });

  return nextRes;
}
