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

import { TaskWithInclude } from '@/types/task';

import EditTaskForm from './EditTaskForm';

type Props = {
  task: TaskWithInclude<'tags' | 'files'>;
};

const EditTaskDialog = ({ task }: Props) => {
  const router = useRouter();

  return (
    <Dialog
      onOpenChange={() => {
        router.back();
      }}
      open={true}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Provide all neccessary information to edit task.
          </DialogDescription>
        </DialogHeader>
        <EditTaskForm initialData={task} onSuccess={() => router.back()} />
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
