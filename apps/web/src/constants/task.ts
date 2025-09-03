import { TaskStatus } from '@/types/task';

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export const TASK_STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE',
  'CANCELLED',
  'FROZEN',
] as const;

export const TASK_STATUSES_COLORS: Record<TaskStatus, string> = {
  OPEN: '#EAB308', // yellow
  IN_PROGRESS: '#F97316', // orange
  IN_REVIEW: '#A78BFA', // purple
  CANCELLED: '#EF4444', // red
  DONE: '#10B981', // emerald
  FROZEN: '#3B82F6', // blue
};

export const TASKS_PAGE_SIZE = 20;
