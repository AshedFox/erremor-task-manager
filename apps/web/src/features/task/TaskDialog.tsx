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

import FullTaskCard from './FullTaskCard';

type Props = {
  task: TaskWithInclude<'tags' | 'creator' | 'files'>;
};

const TaskDialog = ({ task }: Props) => {
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
          <DialogTitle>Task &quot;{task.title}&quot;</DialogTitle>
          <DialogDescription>View task information</DialogDescription>
        </DialogHeader>
        <FullTaskCard task={task} />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
