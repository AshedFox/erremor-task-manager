'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import Pagination from './Pagination';

type Props = {
  className?: string;
  pageIndex: number;
  pageCount: number;
};

const SearchParamsPagination = ({ className, pageIndex, pageCount }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);

    params.set('page', String(page));

    router.push(`?${params.toString()}`);
  };

  return (
    <Pagination
      className={className}
      pageIndex={pageIndex}
      pageCount={pageCount}
      onPageChange={onPageChange}
    />
  );
};

export default SearchParamsPagination;
