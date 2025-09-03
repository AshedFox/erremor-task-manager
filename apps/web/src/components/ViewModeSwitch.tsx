'use client';

import { Button } from '@workspace/ui/components/button';
import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const ViewModeSwitch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewMode = searchParams.get('viewMode');

  const setViewMode = (mode: 'list' | 'kanban') => {
    const params = new URLSearchParams(searchParams);

    if (mode === 'kanban') {
      params.set('viewMode', mode);
    } else {
      params.delete('viewMode');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center rounded-md border border-border overflow-hidden">
      <Button
        className="disabled:text-primary disabled:opacity-100 disabled:bg-accent rounded-none"
        onClick={() => setViewMode('list')}
        size="icon"
        variant="ghost"
        disabled={!viewMode}
      >
        <ListIcon />
      </Button>
      <Button
        className="disabled:text-primary disabled:opacity-100 disabled:bg-accent rounded-none"
        onClick={() => setViewMode('kanban')}
        size="icon"
        variant="ghost"
        disabled={viewMode === 'kanban'}
      >
        <LayoutGridIcon />
      </Button>
    </div>
  );
};

export default ViewModeSwitch;
