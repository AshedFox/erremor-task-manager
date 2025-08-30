import {
  ArrowUpAZ,
  ArrowUpZA,
  ClockArrowDown,
  ClockArrowUp,
} from 'lucide-react';

export const PROJECT_STATUSES = ['OPEN', 'ARCHIVED', 'FREEZED'] as const;

export const PROJECT_SORT = [
  'AZ_ASC',
  'AZ_DESC',
  'CREATED_ASC',
  'CREATED_DESC',
] as const;

export const PROJECT_SORT_OPTIONS: {
  value: (typeof PROJECT_SORT)[number];
  label: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
  { value: 'AZ_ASC', label: 'A-Z', Icon: ArrowUpAZ },
  { value: 'AZ_DESC', label: 'Z-A', Icon: ArrowUpZA },
  { value: 'CREATED_DESC', label: 'New', Icon: ClockArrowUp },
  { value: 'CREATED_ASC', label: 'Old', Icon: ClockArrowDown },
] as const;

export const PROJECT_SORT_PARAMS: Record<
  (typeof PROJECT_SORT)[number],
  { sortBy: string; sortOrder: string }
> = {
  AZ_ASC: { sortBy: 'name', sortOrder: 'asc' },
  AZ_DESC: { sortBy: 'name', sortOrder: 'desc' },
  CREATED_ASC: { sortBy: 'createdAt', sortOrder: 'asc' },
  CREATED_DESC: { sortBy: 'createdAt', sortOrder: 'desc' },
} as const;
