'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

import { PARTICIPANT_ROLES_ICONS } from '@/constants/participant';
import { Invitation, InvitationWithInclude } from '@/types/invitation';
import { ParticipantRole } from '@/types/participant';

import AcceptInvitationDropdownItem from './AcceptInvitationDropdownItem';
import RejectInvitationDropdownItem from './RejectInvitationDropdownItem';

export const userInvitationColumns: ColumnDef<
  InvitationWithInclude<'user' | 'inviter' | 'project'>
>[] = [
  { accessorKey: 'project.name', header: 'Project' },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as ParticipantRole;
      const Icon = PARTICIPANT_ROLES_ICONS[role];

      return (
        <div className="flex items-center gap-1">
          <Icon className="size-4" />
          {role.toLowerCase()}
        </div>
      );
    },
  },
  { accessorKey: 'inviter.username', header: 'Inviter' },
  {
    accessorKey: 'invitedAt',
    header: 'Invited At',
    cell: ({ row }) => format(row.getValue('invitedAt'), 'PPP'),
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires At',
    cell: ({ row }) => format(row.getValue('expiresAt'), 'PPP'),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { projectId } = row.original as Invitation;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AcceptInvitationDropdownItem projectId={projectId} />
            <RejectInvitationDropdownItem projectId={projectId} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
