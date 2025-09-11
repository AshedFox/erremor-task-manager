import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from '@workspace/ui/components/sidebar';
import Link from 'next/link';
import React from 'react';

import ProfileDropdownMenu from '@/features/user/ProfileDropdownMenu';

import Logo from './Logo';
import SidebarNav from './SidebarNav';
import ThemeSwitch from './ThemeSwitch';

type Props = {
  user: User;
};

const AppSidebar = ({ user }: Props) => {
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
