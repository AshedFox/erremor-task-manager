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

import { Project } from '@/types/project';

import EditProjectForm from './EditProjectForm';

type Props = {
  project: Project;
};

const EditProjectDialog = ({ project }: Props) => {
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
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            Provide some information to edit project.
          </DialogDescription>
        </DialogHeader>
        <EditProjectForm
          project={project}
          onSuccess={() => {
            router.back();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
