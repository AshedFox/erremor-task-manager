import { PROJECT_STATUSES } from '@/constants/project';

import { UnionToIntersection } from './common';
import { Participant } from './participant';
import { Task } from './task';

export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
  status: ProjectStatus;
  creatorId: string;
};

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type ProjectIncludeMap = {
  tasks: { tasks: Task[] };
  participants: { participants: Participant[] };
};

export type ProjectWithInclude<K extends keyof ProjectIncludeMap> = Project &
  UnionToIntersection<ProjectIncludeMap[K]>;
