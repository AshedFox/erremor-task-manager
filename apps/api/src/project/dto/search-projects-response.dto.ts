import { ProjectWithRelations } from '../types/project.types';

export class SearchProjectsResponseDto {
  nodes!: ProjectWithRelations[];
  totalCount!: number;
}
