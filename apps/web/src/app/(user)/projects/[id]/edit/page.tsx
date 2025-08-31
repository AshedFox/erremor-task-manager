import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import EditProjectForm from '@/features/project/EditProjectForm';
import { apiFetch } from '@/lib/api-fetch.server';
import { Project } from '@/types/project';

export const metadata: Metadata = {
  title: 'Edit project',
};

type Props = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const project = await apiFetch<Project>(`/projects/${id}`, {
    next: {
      tags: [`project-${id}`],
    },
  });

  return (
    <div className="p-6 flex flex-col md:flex-row items-start gap-4 flex-1">
      <Button variant="ghost" asChild>
        <Link href={`/projects/${id}`} replace>
          <ArrowLeft /> Back
        </Link>
      </Button>
      <div className="space-y-6 max-w-3xl mx-auto w-full h-full">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Edit project</h1>
          <p className="text-muted-foreground">
            Provide some information to edit your project.
          </p>
        </div>
        <Card>
          <CardContent>
            <EditProjectForm project={project} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
