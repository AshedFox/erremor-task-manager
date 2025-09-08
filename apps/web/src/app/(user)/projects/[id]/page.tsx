import { Metadata } from 'next';

import TasksKanbanPreloader from '@/features/task/TasksKanbanPreloader';
import TasksListPreloader from '@/features/task/TasksListPreloader';
import { apiFetch } from '@/lib/api-fetch.server';
import { Project } from '@/types/project';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    viewMode?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await apiFetch<Project>(
    `/projects/${id}?include=tasks,participants`,
    { next: { tags: [`project-${id}`] } }
  );

  return {
    title: project.name,
  };
}

const Page = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const { viewMode } = await searchParams;

  return viewMode === 'kanban' ? (
    <TasksKanbanPreloader projectId={id} />
  ) : (
    <TasksListPreloader projectId={id} />
  );
};

export default Page;
