import { Metadata } from 'next';
import React from 'react';

import EditProjectDialog from '@/features/project/EditProjectDialog';
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

  return <EditProjectDialog project={project} />;
};

export default Page;
