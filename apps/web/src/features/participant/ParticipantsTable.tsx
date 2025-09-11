'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import DataTable from '@/components/DataTable';
import { PARTICIPANTS_PAGE_SIZE } from '@/constants/participant';
import { apiFetch } from '@/lib/api-fetch.client';
import { SearchResult } from '@/types/common';
import { ParticipantWithInclude } from '@/types/participant';

import { participantsColumns } from './participants-columns';

type Props = {
  projectId: string;
};

const ParticipantsTable = ({ projectId }: Props) => {
  const [page, setPage] = useState(0);
  const { data } = useSuspenseQuery({
    queryKey: ['project', projectId, 'participants', page],
    queryFn: () =>
      apiFetch<SearchResult<ParticipantWithInclude<'user'>>>(
        `/projects/${projectId}/users?include=user&page=${page}&limit=${PARTICIPANTS_PAGE_SIZE}&sortBy=joinedAt&sortOrder=asc`
      ),
  });

  return (
    <DataTable
      data={data.nodes}
      columns={participantsColumns}
      pageCount={Math.ceil(data.totalCount / PARTICIPANTS_PAGE_SIZE)}
      pageIndex={page}
      pageSize={PARTICIPANTS_PAGE_SIZE}
      onPageChange={(page) => setPage(page)}
    />
  );
};

export default ParticipantsTable;
