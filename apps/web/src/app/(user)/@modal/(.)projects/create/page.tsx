import { Metadata } from 'next';
import React from 'react';

import CreateProjectDialog from '@/features/project/CreateProjectDialog';

export const metadata: Metadata = {
  title: 'Create project',
};

const Page = () => {
  return <CreateProjectDialog />;
};

export default Page;
