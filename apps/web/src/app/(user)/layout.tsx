import { Separator } from '@workspace/ui/components/separator';
import { redirect } from 'next/navigation';
import React from 'react';

import Header from '@/components/Header';
import { UserProvider } from '@/features/auth/UserContext';
import { getUser } from '@/lib/get-user.server';

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <UserProvider initialUser={user}>
      <Header />
      <Separator />
      {children}
    </UserProvider>
  );
};

export default Layout;
