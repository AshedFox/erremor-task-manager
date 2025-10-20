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

import CreateTaskForm from './CreateTaskForm';

type Props = {
  projectId: string;
};

const CreateTaskDialog = ({ projectId }: Props) => {
  const router = useRouter();

  return (
    <Dialog
      onOpenChange={() => {
        router.back();
      }}
      open={true}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Provide all neccessary information to create new task.
          </DialogDescription>
        </DialogHeader>
        <CreateTaskForm projectId={projectId} onSuccess={() => router.back()} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
