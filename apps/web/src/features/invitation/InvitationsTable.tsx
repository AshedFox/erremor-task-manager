'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import DataTable from '@/components/DataTable';
import { INVITATIONS_PAGE_SIZE } from '@/constants/invitation';
import { apiFetch } from '@/lib/api-fetch.client';
import { SearchResult } from '@/types/common';
import { InvitationWithInclude } from '@/types/invitation';

import { invitationColumns } from './invitation-columns';

type Props = {
  projectId: string;
};

const InvitationsTable = ({ projectId }: Props) => {
  const [page, setPage] = useState(0);
  const { data } = useSuspenseQuery({
    queryKey: ['project', projectId, 'invitations', page],
    queryFn: () =>
      apiFetch<SearchResult<InvitationWithInclude<'user' | 'inviter'>>>(
        `/projects/${projectId}/invitations?include=user,inviter&page=${page}&limit=${INVITATIONS_PAGE_SIZE}&sortBy=invitedAt&sortOrder=desc`
      ),
  });

  return (
    <DataTable
      data={data.nodes}
      columns={invitationColumns}
      pageCount={Math.ceil(data.totalCount / INVITATIONS_PAGE_SIZE)}
      pageIndex={page}
      pageSize={INVITATIONS_PAGE_SIZE}
      onPageChange={(page) => setPage(page)}
    />
  );
};

export default InvitationsTable;
