import { Button } from '@workspace/ui/components/button';
import { ArrowLeftIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import FullTaskCard from '@/features/task/FullTaskCard';
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
  const task = await apiFetch<Task>(`/tasks/${taskId}?include=tags,creator`, {
    next: { tags: [`tasks-${taskId}`] },
  });

  return {
    title: `Task "${task.title}"`,
    description: task.description,
  };
}

const Page = async ({ params }: Props) => {
  const { id, taskId } = await params;
  const task = await apiFetch<TaskWithInclude<'tags' | 'creator'>>(
    `/tasks/${taskId}?include=tags,creator`,
    { next: { tags: [`tasks-${taskId}`] } }
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4 justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-2"
          asChild
        >
          <Link href={`/projects/${id}`}>
            <ArrowLeftIcon /> Back
          </Link>
        </Button>
      </div>
      <FullTaskCard task={task} />
    </div>
  );
};

export default Page;
