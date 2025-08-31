'use client';

import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';

type Props = {
  className?: string;
};

const SearchBar = ({ className }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get('search') ?? '');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setQuery(searchParams.get('search') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set('search', debouncedQuery);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className={cn('relative', className)}>
      <SearchIcon className="absolute left-4 top-1/2 transform -translate-1/2 size-4 text-muted-foreground" />
      <Input
        className="pl-10"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
