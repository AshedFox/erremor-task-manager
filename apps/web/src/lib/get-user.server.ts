import 'server-only';

import { cookies } from 'next/headers';

import { ACCESS_TOKEN_COOKIE_KEY, API_BASE_URL } from '@/constants/env';
import { User } from '@/types/user';

export async function getUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  if (!accessToken) {
    return null;
  }

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as User;
}
