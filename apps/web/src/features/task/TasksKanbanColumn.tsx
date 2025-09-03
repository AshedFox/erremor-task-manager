'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { ScrollArea, ScrollBar } from '@workspace/ui/components/scroll-area';
import React from 'react';

import Draggable from '@/components/Draggable';
import Spinner from '@/components/Spinner';
import { TASK_STATUSES_COLORS, TASKS_PAGE_SIZE } from '@/constants/task';
import { apiFetch } from '@/lib/api-fetch.client';
import { Paginated } from '@/types/common';
import { TaskStatus, TaskWithInclude } from '@/types/task';

import TaskCard from './TaskCard';

type Props = {
  projectId: string;
  status: TaskStatus;
};

const TasksKanbanColumn = ({ projectId, status }: Props) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery<Paginated<TaskWithInclude<'tags'>>>({
      queryKey: ['tasks', { projectId, status, viewMode: 'kanban' }],
      queryFn: ({ pageParam }) =>
        apiFetch(
          `/tasks?include=tags&projectId=${projectId}&status=${status}${pageParam ? `&cursor=${pageParam}` : ''}&limit=${TASKS_PAGE_SIZE}`
        ),
      getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
      initialPageParam: 0,
    });

  const items = data?.pages.flatMap((item) => item.data);

  return (
    <Card
      id={status}
      style={{
        backgroundColor: `${TASK_STATUSES_COLORS[status]}12`,
        borderColor: `${TASK_STATUSES_COLORS[status]}54`,
      }}
      className="bg-background border-dashed border-2 min-h-48 p-4 gap-4 min-w-64 shrink-0 max-w-96 overflow-hidden"
    >
      <CardHeader className="flex items-center justify-between px-0 gap-2">
        <CardTitle className="flex items-center gap-2">
          <div
            style={{ backgroundColor: TASK_STATUSES_COLORS[status] }}
            className="size-2 rounded-full"
          />
          <h3 className="font-semibold text-lg">
            {status
              .split('_')
              .map((word) => word.at(0) + word.slice(1).toLowerCase())
              .join(' ')}
          </h3>
        </CardTitle>
        <Badge variant="secondary">{items?.length ?? 0}</Badge>
      </CardHeader>
      <CardContent className="flex-1 px-0">
        {items && items.length > 0 ? (
          <ScrollArea>
            <div className="flex flex-col gap-2 p-1">
              {items.map((task) => (
                <Draggable
                  className="flex"
                  data={task}
                  key={task.id}
                  id={task.id}
                >
                  <TaskCard task={task} />
                </Draggable>
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
          <div className="size-full flex items-center justify-center text-muted-foreground ">
            Nothing here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksKanbanColumn;
