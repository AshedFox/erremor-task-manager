import { Prisma, Project } from '@prisma/client';

import { CreateProjectDto } from '../dto/create-project.dto';
import { SearchProjectsFilterDto } from '../dto/search-projects-filter.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

export type CreateProjectParams = CreateProjectDto & { creatorId: string };
export type UpdateProjectParams = UpdateProjectDto;
export type FindManyProjectsFilter = SearchProjectsFilterDto & {
  userId: string;
};
export type ProjectWithRelations = Project &
  Partial<
    Prisma.ProjectGetPayload<{
      include: {
        creator: true;
        participants: true;
        tasks: true;
      };
    }>
  >;
