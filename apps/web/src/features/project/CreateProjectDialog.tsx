'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { useRouter } from 'next/navigation';
import React from 'react';

import CreateProjectForm from './CreateProjectForm';

const CreateProjectDialog = () => {
  const router = useRouter();

  return (
    <Dialog
      onOpenChange={() => {
        router.back();
      }}
      open={true}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Provide all neccessary information to create new project.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
