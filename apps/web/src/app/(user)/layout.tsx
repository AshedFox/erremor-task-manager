import { Separator } from '@workspace/ui/components/separator';
import {
  SidebarInset,
  SidebarProvider,
} from '@workspace/ui/components/sidebar';
import React from 'react';

import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { UserProvider } from '@/features/auth/UserContext';
import { apiFetch } from '@/lib/api-fetch.server';
import { UserWithInclude } from '@/types/user';

const Layout = async ({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) => {
  const user = await apiFetch<UserWithInclude<'avatar'>>(
    '/users/me?include=avatar'
  );

  return (
    <UserProvider initialUser={user}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <Header />
          <Separator />
          {children}
          {modal}
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
};

export default Layout;
