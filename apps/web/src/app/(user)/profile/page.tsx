import { Metadata } from 'next';
import React from 'react';

import ProfileCard from '@/features/user/ProfileCard';
import { apiFetch } from '@/lib/api-fetch.server';
import { User } from '@/types/user';

export const metadata: Metadata = {
  title: 'Profile',
};

const Page = async () => {
  const user = await apiFetch<User>('/users/me');

  return (
    <div className="p-6 mx-auto space-y-6 w-full max-w-3xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Discover and manage your account information
        </p>
      </div>
      <ProfileCard user={user} />
    </div>
  );
};

export default Page;
