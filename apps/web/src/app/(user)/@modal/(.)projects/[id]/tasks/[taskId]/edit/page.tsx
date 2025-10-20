import { Metadata } from 'next';
import React from 'react';

import EditTaskDialog from '@/features/task/EditTaskDialog';
import { apiFetch } from '@/lib/api-fetch.server';
import { Task, TaskWithInclude } from '@/types/task';

type Props = {
  params: Promise<{
    id: string;
    taskId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskId } = await params;
  const task = await apiFetch<Task>(`/tasks/${taskId}`, {
    next: { tags: [`tasks-${taskId}`] },
  });

  return {
    title: `Edit Task "${task.title}"`,
    description: task.description,
  };
}

const Page = async ({ params }: Props) => {
  const { taskId } = await params;
  const task = await apiFetch<TaskWithInclude<'tags' | 'creator' | 'files'>>(
    `/tasks/${taskId}?include=tags,creator,files`,
    { next: { tags: [`tasks-${taskId}`] } }
  );

  return <EditTaskDialog task={task} />;
};

export default Page;
