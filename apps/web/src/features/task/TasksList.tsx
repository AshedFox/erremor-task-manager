'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '@workspace/ui/components/button';
import React, { useCallback, useMemo, useRef } from 'react';

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

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground ">
        Nothing here...
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div ref={scrollElementRef} className="flex-1 basis-0 overflow-auto p-4">
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
                <TaskCard task={task} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TasksList;
