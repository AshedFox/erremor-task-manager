import { PROJECT_STATUSES } from '@/constants/project';

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
