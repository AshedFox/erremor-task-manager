import { Metadata } from 'next';
import React from 'react';

import EditProfileDialog from '@/features/user/EditProfileDialog';
import { apiFetch } from '@/lib/api-fetch.server';
import { User } from '@/types/user';

export const metadata: Metadata = {
  title: 'Edit profile',
};

const Page = async () => {
  const user = await apiFetch<User>('/users/me');

  return <EditProfileDialog user={user} />;
};

export default Page;
