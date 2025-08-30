import { Project } from '@prisma/client';

export class SearchProjectsResponseDto {
  nodes!: Project[];
  totalCount!: number;
}
