import { SetMetadata } from '@nestjs/common';

export const PROJECT_ID_SOURCE_KEY = 'project_id_source';

export type ProjectIdSourceVariant = 'params' | 'body' | 'query';

export const ProjectIdSource = (source: ProjectIdSourceVariant) =>
  SetMetadata(PROJECT_ID_SOURCE_KEY, source);
