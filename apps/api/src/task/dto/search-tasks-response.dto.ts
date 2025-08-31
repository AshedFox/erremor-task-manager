import { Task } from '@prisma/client';

export class SearchTasksResponseDto {
  nodes!: Task[];
  totalCount!: number;
}
