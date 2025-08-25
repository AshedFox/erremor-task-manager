'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from '@workspace/ui/components/sidebar';
import { ChevronDownIcon, SettingsIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import LogoutDropdownItem from '@/features/auth/LogoutDropdownItem';
import { User } from '@/types/user';

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
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center gap-2 h-auto overflow-hidden flex-1 group-data-[state=collapsed]:p-0"
              variant="ghost"
            >
              <Avatar className="shrink-0">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=face&crop=face"
                  alt="user"
                />
                <AvatarFallback className="bg-sidebar-accent">
                  {user?.username
                    .split('-')
                    .slice(0, 2)
                    .map((word) => word[0]?.toUpperCase())
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="group-data-[state=collapsed]:hidden overflow-hidden text-left">
                <h2
                  className="font-bold truncate"
                  title={user.displayName ?? user.username}
                >
                  {user.displayName ?? user.username}
                </h2>
                <p
                  className="text-xs truncate text-muted-foreground"
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>
              <ChevronDownIcon className="ml-auto group-data-[state=collapsed]:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile/settings">
                <SettingsIcon /> Settings
              </Link>
            </DropdownMenuItem>
            <LogoutDropdownItem />
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeSwitch className="group-data-[state=collapsed]:hidden" />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
