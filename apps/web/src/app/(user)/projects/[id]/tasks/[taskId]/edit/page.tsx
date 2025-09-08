import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { ArrowLeftIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import EditTaskForm from '@/features/task/EditTaskForm';
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
    title: `Edit Task "${task.title}"`,
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
          <Link href={`/projects/${id}/tasks/${taskId}`} replace>
            <ArrowLeftIcon /> Back
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit task</CardTitle>
          <CardDescription>
            Provide some information to edit your task.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditTaskForm initialData={task} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
