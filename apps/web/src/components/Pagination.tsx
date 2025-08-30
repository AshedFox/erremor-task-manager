'use client';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import React from 'react';

type Props = {
  className?: string;
  pageCount: number;
  pageIndex: number;
  onPageChange: (pageIndex: number) => void;
};

const Pagination = ({
  className,
  pageIndex,
  pageCount,
  onPageChange,
}: Props) => {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div className="flex items-center justify-center text-sm font-semibold">
        Page {pageIndex + 1} of {pageCount}
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={() => onPageChange(0)}
          disabled={pageIndex <= 0}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex <= 0}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={() => onPageChange(pageCount - 1)}
          disabled={pageIndex >= pageCount - 1}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
