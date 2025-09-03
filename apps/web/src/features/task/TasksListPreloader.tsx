import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

import { TASKS_PAGE_SIZE } from '@/constants/task';
import TasksList from '@/features/task/TasksList';
import { apiFetch } from '@/lib/api-fetch.server';
import { getQueryClient } from '@/lib/query-client';

type Props = {
  projectId: string;
};

const TasksListPreloader = async ({ projectId }: Props) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['tasks', { projectId, viewMode: 'list' }],
    queryFn: () =>
      apiFetch(
        `/tasks?include=tags&projectId=${projectId}&limit=${TASKS_PAGE_SIZE}`
      ),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksList projectId={projectId} />
    </HydrationBoundary>
  );
};

export default TasksListPreloader;
