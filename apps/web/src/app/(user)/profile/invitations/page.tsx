import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { INVITATIONS_PAGE_SIZE } from '@/constants/invitation';
import UserInvitationsTable from '@/features/invitation/UserInvitationsTable';
import { apiFetch } from '@/lib/api-fetch.server';
import { getQueryClient } from '@/lib/query-client';

export const metadata: Metadata = {
  title: 'Your invitations',
};

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    queryKey: ['user', 'invitations', 0],
    queryFn: () =>
      apiFetch(
        `/users/me/invitations?include=inviter,project,user&page=0&limit=${INVITATIONS_PAGE_SIZE}&sortBy=invitedAt&sortOrder=desc`,
        { next: { tags: ['current-user-invitations'] } }
      ),
  });

  return (
    <div className="p-6 flex flex-col items-start gap-4">
      <Button className="" variant="ghost" asChild>
        <Link href={`/profile`}>
          <ArrowLeft /> Go To Profile
        </Link>
      </Button>
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
            <CardDescription>Discover your invitations</CardDescription>
          </CardHeader>
          <CardContent>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <UserInvitationsTable />
            </HydrationBoundary>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
