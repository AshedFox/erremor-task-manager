import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_KEY, API_BASE_URL } from '@/constants/env';

type Context = {
  params: Promise<{ path: string[] }>;
};

export async function GET(req: NextRequest, { params }: Context) {
  return handleProxy(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: Context) {
  return handleProxy(req, (await params).path);
}
export async function PUT(req: NextRequest, { params }: Context) {
  return handleProxy(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: Context) {
  return handleProxy(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: Context) {
  return handleProxy(req, (await params).path);
}

async function handleProxy(req: NextRequest, path: string[]) {
  const url = `${API_BASE_URL}/${path.join('/')}${req.nextUrl.search}`;
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  let res = await forwardRequest(req, url, accessToken);

  if (res.status === 401) {
    const refreshRes = await fetch(new URL('/api/auth/refresh', req.url), {
      method: 'POST',
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      res = await forwardRequest(req, url, data.accessToken);
    }
    res.headers.append(
      'set-cookie',
      refreshRes.headers.get('set-cookie') || ''
    );
  }

  return res;
}

async function forwardRequest(
  req: NextRequest,
  url: string,
  accessToken?: string
) {
  const headers = new Headers(req.headers);

  headers.delete('cookie');
  headers.delete('host');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : await req.text();

  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body,
    cache: req.cache,
  });

  const resHeaders = new Headers(upstream.headers);
  headers.delete('Content-Length');

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });

  return res;
}
