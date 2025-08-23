import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_KEY, API_BASE_URL } from '@/constants/env';

export async function POST(request: NextRequest) {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: request.headers.get('cookie') || '',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });

  const nextRes = new NextResponse(null, {
    status: res.status,
    headers: {
      'set-cookie': res.headers.get('set-cookie') || '',
    },
  });

  console.log(await res.text(), request.headers.get('cookie'));

  if (res.ok) {
    nextRes.cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
  }

  return nextRes;
}
