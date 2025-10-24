import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from '@workspace/ui/components/sidebar';
import Link from 'next/link';
import React, { Suspense } from 'react';

import RecentProjectsSidebarMenu from '@/features/project/RecentProjectsSidebarGroup';
import ProfileDropdownMenu from '@/features/user/ProfileDropdownMenu';
import { apiFetch } from '@/lib/api-fetch.server';
import { getQueryClient } from '@/lib/query-client';
import { User } from '@/types/user';

import Logo from './Logo';
import SidebarNav from './SidebarNav';
import Spinner from './Spinner';
import ThemeSwitch from './ThemeSwitch';

const AppSidebar = async () => {
  const queryClient = getQueryClient();

  const user = await apiFetch<User>('/users/me');

  await queryClient.prefetchQuery({
    queryKey: ['projects', 'recent', user.id],
    queryFn: () => apiFetch('/projects/recent?limit=5'),
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Logo className="size-8 shrink-0" />
          <span className="truncate font-mono font-extrabold text-2xl text-transparent bg-clip-text bg-linear-140 from-[#fd711e] to-[#464598]">
            Erremor
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
        <SidebarGroup>
          <SidebarGroupLabel>Recent projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense fallback={<Spinner />}>
                <RecentProjectsSidebarMenu userId={user.id} />
              </Suspense>
            </HydrationBoundary>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="mx-auto" />
      <SidebarFooter className="flex-row items-center overflow-hidden gap-1 px-1">
        <ProfileDropdownMenu />
        <ThemeSwitch className="group-data-[state=collapsed]:hidden" />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
