import { Metadata } from 'next';
import React from 'react';

import AccountActivator from '@/features/auth/AccountActivator';

export const metadata: Metadata = {
  title: 'Activate',
};

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

const Page = async ({ searchParams }: Props) => {
  const { token } = await searchParams;

  return (
    <div className="p-4 bg-linear-120 to-primary/15 flex-1 flex items-center justify-center">
      <AccountActivator token={token} />
    </div>
  );
};

export default Page;
