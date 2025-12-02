import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import React from 'react';

type Props = {
  onAbort: () => void;
  onOverwrite: () => void;
};

const TaskEditConflictAlert = ({ onAbort, onOverwrite }: Props) => {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Failed to edit task</AlertDialogTitle>
          <AlertDialogDescription>
            Another user changed this task. You may overwrite remote changes
            with your local, or abort your local changes and get new data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onOverwrite}>
            Overwrite remote
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAbort}>Abort local</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TaskEditConflictAlert;
