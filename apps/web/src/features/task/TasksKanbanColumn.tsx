'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import React, { useCallback, useMemo, useRef } from 'react';

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

  const items = useMemo(
    () => data?.pages.flatMap((item) => item.data) || [],
    [data?.pages]
  );

  const scrollElementRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length + (hasNextPage ? 1 : 0),
    getScrollElement: () => scrollElementRef.current,
    estimateSize: useCallback(
      (index: number) => {
        if (index === items.length) {
          return 48;
        }

        return 200;
      },
      [items.length]
    ),
    overscan: 5,
    getItemKey: useCallback(
      (index: number) => {
        if (index === items.length) {
          return 'load-more-button';
        }
        return items[index]?.id || `item-${index}`;
      },
      [items]
    ),
  });

  const virtualItems = virtualizer.getVirtualItems();

  const handleLoadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Card
      id={status}
      style={{
        backgroundColor: `${TASK_STATUSES_COLORS[status]}12`,
        borderColor: `${TASK_STATUSES_COLORS[status]}54`,
      }}
      className="bg-background border-dashed border-2 p-4 gap-4 shrink-0 w-64 md:w-96 overflow-hidden"
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
      <CardContent className="flex flex-col flex-1 px-0">
        {items.length > 0 ? (
          <div
            ref={scrollElementRef}
            className="flex-1 basis-0 overflow-y-auto overflow-x-hidden px-1"
          >
            <div
              className="relative w-full"
              style={{
                height: `${virtualizer.getTotalSize()}px`,
              }}
            >
              {virtualItems.map((virtualItem) => {
                const isLoadMoreButton = virtualItem.index === items.length;

                if (isLoadMoreButton) {
                  return (
                    <div
                      key={virtualItem.key}
                      className="top-0 left-0 w-full absolute"
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <Button
                        disabled={isFetchingNextPage}
                        onClick={handleLoadMore}
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
                    </div>
                  );
                }

                const task = items[virtualItem.index];

                if (!task) {
                  return null;
                }

                return (
                  <div
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={virtualizer.measureElement}
                    style={{
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="pb-2 top-0 left-0 w-full absolute"
                  >
                    <Draggable
                      className="flex-1"
                      data={task}
                      key={task.id}
                      id={task.id}
                    >
                      <TaskCard task={task} />
                    </Draggable>
                  </div>
                );
              })}
            </div>
          </div>
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
