import { Button } from '@workspace/ui/components/button';
import { PlusIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import SearchParamsPagination from '@/components/SearchParamsPagination';
import {
  PROJECT_SORT,
  PROJECT_SORT_PARAMS,
  PROJECTS_PAGE_SIZE,
} from '@/constants/project';
import ProjectCard from '@/features/project/ProjectCard';
import ProjectSortSelect from '@/features/project/ProjectSortSelect';
import { apiFetch } from '@/lib/api-fetch.server';
import { pageSchema, searchSchema } from '@/lib/validation/common';
import { projectSortSchema } from '@/lib/validation/project';
import { SearchResult } from '@/types/common';
import { ProjectIncludeMap, ProjectWithInclude } from '@/types/project';
import { User } from '@/types/user';

export const metadata: Metadata = {
  title: 'Projects',
};

type Props = {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
};

const makeProjectsUrl = (
  page: number,
  sort: (typeof PROJECT_SORT)[number],
  include: (keyof ProjectIncludeMap)[],
  search?: string
): string => {
  let url = `/projects?include=${include.join(',')}&page=${page}&limit=${PROJECTS_PAGE_SIZE}`;

  if (search) {
    url += `&search=${search}`;
  }

  const sortParams = PROJECT_SORT_PARAMS[sort];

  url += `&sortBy=${sortParams.sortBy}&sortOrder=${sortParams.sortOrder}`;

  return url;
};

const Page = async (props: Props) => {
  const searchParams = await props.searchParams;
  const search = searchSchema.parse(searchParams?.search);
  const page = pageSchema.parse(searchParams?.page);
  const sort = projectSortSchema.parse(searchParams?.sort);
  const user = await apiFetch<User>('/users/me', {
    next: {
      tags: ['current-user'],
    },
  });
  const { nodes: projects, totalCount } = await apiFetch<
    SearchResult<ProjectWithInclude<'tasks' | 'participants'>>
  >(makeProjectsUrl(page, sort, ['tasks', 'participants'], search), {
    next: {
      tags: ['projects'],
    },
  });

  return (
    <div className="px-6 py-4 space-y-6 flex flex-col flex-1">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold leading-relaxed truncate">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground line-clamp-4">
            Discover all your projects
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <ProjectSortSelect value={sort} placeholder="Sort" />
          <Button asChild>
            <Link href="/projects/create">
              <PlusIcon /> New project
            </Link>
          </Button>
        </div>
      </div>
      {projects.length === 0 ? (
        <div className="flex items-center justify-center m-auto flex-1 text-muted-foreground text-xl font-bold">
          No projects yet...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} user={user} />
          ))}
        </div>
      )}
      <SearchParamsPagination
        className="mt-auto justify-end"
        pageIndex={page}
        pageCount={Math.ceil(totalCount / PROJECTS_PAGE_SIZE)}
      />
    </div>
  );
};

export default Page;
