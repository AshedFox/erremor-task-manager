import { Separator } from '@workspace/ui/components/separator';
import {
  SidebarInset,
  SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { redirect } from 'next/navigation';
import React from 'react';

import AppSidebar from '@/components/AppSidebar';
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
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset className="overflow-hidden">
          <Header />
          <Separator />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
};

export default Layout;
