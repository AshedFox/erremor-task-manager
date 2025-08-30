'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { PROJECT_SORT, PROJECT_SORT_OPTIONS } from '@/constants/project';

type Props = {
  className?: string;
  placeholder?: string;
  value: (typeof PROJECT_SORT)[number];
};

const ProjectSortSelect = ({ className, placeholder, value }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set('sort', value);

    router.push(`?${params.toString()}`);
  };

  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {PROJECT_SORT_OPTIONS.map(({ label, value, Icon }) => (
          <SelectItem key={value} value={value}>
            {label}
            {Icon && <Icon />}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectSortSelect;
