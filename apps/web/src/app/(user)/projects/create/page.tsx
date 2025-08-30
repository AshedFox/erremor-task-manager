import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import CreateProjectForm from '@/features/project/CreateProjectForm';

export const metadata: Metadata = {
  title: 'Create project',
};

const Page = () => {
  return (
    <div className="p-6 flex flex-col md:flex-row items-start gap-4 flex-1">
      <Button variant="ghost" asChild>
        <Link href="/projects" replace>
          <ArrowLeft /> Back
        </Link>
      </Button>
      <div className="space-y-6 max-w-3xl mx-auto w-full h-full">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Create project</h1>
          <p className="text-muted-foreground">
            Provide all neccessary information to create new project.
          </p>
        </div>
        <Card>
          <CardContent>
            <CreateProjectForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
