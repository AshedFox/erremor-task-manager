'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@workspace/ui/components/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { SIDEBAR_NAV_ITEMS } from '@/constants/nav';

const SidebarNav = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {SIDEBAR_NAV_ITEMS.map(({ id, href, label, Icon }) => (
          <SidebarMenuItem key={id}>
            <SidebarMenuButton
              className="text-muted-foreground"
              isActive={pathname.startsWith(href)}
              tooltip={label}
              asChild
            >
              <Link href={href}>
                {Icon && <Icon />}
                {label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarNav;
