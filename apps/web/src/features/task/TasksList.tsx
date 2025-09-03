'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea, ScrollBar } from '@workspace/ui/components/scroll-area';
import React from 'react';

import Spinner from '@/components/Spinner';
import { TASKS_PAGE_SIZE } from '@/constants/task';
import { apiFetch } from '@/lib/api-fetch.client';
import { Paginated } from '@/types/common';
import { TaskWithInclude } from '@/types/task';

import TaskCard from './TaskCard';

type Props = {
  projectId: string;
};

const TasksList = ({ projectId }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<Paginated<TaskWithInclude<'tags'>>>({
      queryKey: ['tasks', { projectId, viewMode: 'list' }],
      queryFn: ({ pageParam }) =>
        apiFetch(
          `/tasks?include=tags&projectId=${projectId}${pageParam ? `&cursor=${pageParam}` : ''}&limit=${TASKS_PAGE_SIZE}`
        ),
      getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
      initialPageParam: 0,
    });

  const items = data?.pages.flatMap((item) => item.data);

  return (
    <div className="flex flex-col gap-2 flex-1">
      {items && items.length > 0 ? (
        <ScrollArea className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {items.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {hasNextPage && (
              <Button
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? (
                  <>
                    <Spinner />
                    Loading...
                  </>
                ) : (
                  'Load more'
                )}
              </Button>
            )}
          </div>
          <ScrollBar />
        </ScrollArea>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground ">
          Nothing here...
        </div>
      )}
    </div>
  );
};

export default TasksList;
