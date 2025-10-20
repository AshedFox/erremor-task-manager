import { FILE_STATUSES, FILE_TYPES } from '@/constants/file';

export type FileType = (typeof FILE_TYPES)[number];

export type FileStatus = (typeof FILE_STATUSES)[number];

export type File = {
  id: string;
  name: string;
  type: FileType;
  mimetype: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
};
