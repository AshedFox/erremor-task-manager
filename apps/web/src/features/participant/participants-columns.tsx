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

import {
  PARTICIPANT_ROLES_ICONS,
  PARTICIPANT_STATUSES_ICONS,
} from '@/constants/participant';
import {
  ParticipantRole,
  ParticipantStatus,
  ParticipantWithInclude,
} from '@/types/participant';

import KickParticipantDropdownItem from './KickParticipantDropdownItem';

export const participantsColumns: ColumnDef<ParticipantWithInclude<'user'>>[] =
  [
    { accessorKey: 'user.username', header: 'User' },
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
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as ParticipantStatus;
        const Icon = PARTICIPANT_STATUSES_ICONS[status];

        return (
          <div className="flex items-center gap-1">
            <Icon className="size-4" />
            {status.toLowerCase()}
          </div>
        );
      },
    },
    {
      accessorKey: 'joinedAt',
      header: 'Joined At',
      cell: ({ row }) => {
        const joinedAt = row.getValue('joinedAt') as string | undefined;

        return joinedAt ? format(joinedAt, 'PPP') : '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const participant = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="size-8 p-0"
                disabled={participant.status !== 'JOINED'}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <KickParticipantDropdownItem
                projectId={participant.projectId}
                userId={participant.userId}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
