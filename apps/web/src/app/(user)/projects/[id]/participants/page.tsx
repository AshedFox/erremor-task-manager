import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import { INVITATIONS_PAGE_SIZE } from '@/constants/invitation';
import {
  PARTICIPANT_ROLES_HIERARCHY,
  PARTICIPANTS_PAGE_SIZE,
} from '@/constants/participant';
import InvitationsTable from '@/features/invitation/InvitationsTable';
import InviteParticipantDialog from '@/features/participant/InviteParticipantDialog';
import ParticipantsTable from '@/features/participant/ParticipantsTable';
import { apiFetch } from '@/lib/api-fetch.server';
import { getQueryClient } from '@/lib/query-client';
import { Participant } from '@/types/participant';

export const metadata: Metadata = {
  title: 'Participants',
};

type Props = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    queryKey: ['project', id, 'invitations', 0],
    queryFn: () =>
      apiFetch(
        `/projects/${id}/invitations?include=user,inviter&limit=${INVITATIONS_PAGE_SIZE}&sortBy=invitedAt&sortOrder=desc`,
        { next: { tags: [`project-${id}-invitations`] } }
      ),
  });
  void queryClient.prefetchQuery({
    queryKey: ['project', id, 'participants', 0],
    queryFn: () =>
      apiFetch(
        `/projects/${id}/users?include=user&limit=${PARTICIPANTS_PAGE_SIZE}&sortBy=joinedAt&sortOrder=asc`,
        { next: { tags: [`project-${id}-participants`] } }
      ),
  });
  const currentParticipant = await apiFetch<Participant>(
    `/projects/${id}/users/me`,
    { next: { tags: [`project-${id}-participants`] } }
  );

  return (
    <div className="p-6 flex flex-col items-start gap-4">
      <Button className="" variant="ghost" asChild>
        <Link href={`/projects/${id}`}>
          <ArrowLeft /> Back To Project
        </Link>
      </Button>
      <div className="flex flex-col gap-6 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>
              Discover participants related to current project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <ParticipantsTable projectId={id} />
            </HydrationBoundary>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
            <CardDescription>
              Discover invitaions related to current project
            </CardDescription>
            {PARTICIPANT_ROLES_HIERARCHY[currentParticipant.role] >=
              PARTICIPANT_ROLES_HIERARCHY['ADMIN'] && (
              <CardAction>
                <InviteParticipantDialog
                  projectId={id}
                  currentParticipant={currentParticipant}
                />
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <InvitationsTable projectId={id} />
            </HydrationBoundary>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
