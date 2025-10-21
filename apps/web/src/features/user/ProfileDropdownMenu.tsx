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
  ChevronDownIcon,
  MailQuestionIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import LogoutDropdownItem from '../auth/LogoutDropdownItem';
import { useUser } from '../auth/UserContext';

const ProfileDropdownMenu = () => {
  const { user } = useUser();
  const avatarFallback = user.username
    .split('-')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
  const displayName = user.displayName ?? user.username;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex items-center gap-2 h-auto overflow-hidden flex-1 group-data-[state=collapsed]:p-0"
          variant="ghost"
        >
          <Avatar className="shrink-0">
            <AvatarImage
              className="object-cover"
              src={user.avatar?.url}
              alt="user"
            />
            <AvatarFallback className="bg-sidebar-accent">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="group-data-[state=collapsed]:hidden overflow-hidden text-left">
            <h2 className="font-bold truncate" title={displayName}>
              {displayName}
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
          <Link href="/profile/invitations">
            <MailQuestionIcon /> Invitations
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
  );
};

export default ProfileDropdownMenu;
