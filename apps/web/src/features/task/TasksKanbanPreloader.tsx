import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

import { TASK_STATUSES, TASKS_PAGE_SIZE } from '@/constants/task';
import TasksKanban from '@/features/task/TasksKanban';
import { apiFetch } from '@/lib/api-fetch.server';
import { getQueryClient } from '@/lib/query-client';

type Props = {
  projectId: string;
};

const TasksKanbanPreloader = async ({ projectId }: Props) => {
  const queryClient = getQueryClient();
  await Promise.all(
    TASK_STATUSES.map((status) =>
      queryClient.prefetchInfiniteQuery({
        queryKey: ['tasks', { projectId, viewMode: 'kanban', status }],
        queryFn: () =>
          apiFetch(
            `/tasks?include=tags&status=${status}&projectId=${projectId}&limit=${TASKS_PAGE_SIZE}`
          ),
        initialPageParam: 0,
      })
    )
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksKanban projectId={projectId} />
    </HydrationBoundary>
  );
};

export default TasksKanbanPreloader;
