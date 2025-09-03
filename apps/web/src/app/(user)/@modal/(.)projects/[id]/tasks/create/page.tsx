import { Metadata } from 'next';
import React from 'react';

import CreateTaskDialog from '@/features/task/CreateTaskDialog';

export const metadata: Metadata = {
  title: 'Create task',
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <CreateTaskDialog projectId={id} />;
};

export default Page;
