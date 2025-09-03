import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants/task';

import { CheckListItem } from './check-list';
import { UnionToIntersection } from './common';
import { Project } from './project';
import { Tag } from './tag';
import { User } from './user';

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

export type TaskIncludeMap = {
  project: { project: Project[] };
  creator: { creator: User };
  tags: { tags: Tag[] };
  checkList: { checklist: CheckListItem[] };
};

export type TaskWithInclude<K extends keyof TaskIncludeMap> = Task &
  UnionToIntersection<TaskIncludeMap[K]>;
