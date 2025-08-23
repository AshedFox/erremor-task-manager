import { Separator } from '@workspace/ui/components/separator';
import React from 'react';

import Header from '@/components/Header';
import { UserProvider } from '@/features/auth/UserContext';
import { getServerUser } from '@/lib/user.server';

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = (await getServerUser())!;

  return (
    <UserProvider initialUser={user}>
      <Header />
      <Separator />
      {children}
    </UserProvider>
  );
};

export default Layout;
