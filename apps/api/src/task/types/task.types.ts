import { Task } from '@prisma/client';

import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

export type CreateTaskParams = CreateTaskDto & {
  creatorId: string;
};
export type UpdateTaskParams = UpdateTaskDto;
export type FindManyTasksResult = [Task[], number];
