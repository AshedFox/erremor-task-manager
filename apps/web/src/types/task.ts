import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants/task';

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type Task = {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  status: TaskStatus;
  priority: TaskPriority;
};
