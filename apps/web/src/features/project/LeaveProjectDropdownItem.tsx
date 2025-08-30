'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import Spinner from '@/components/Spinner';
import { leaveProject } from '@/lib/actions/leave-project';

type Props = {
  projectId: string;
};

const LeaveProjectDropdownItem = ({ projectId }: Props) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await leaveProject(projectId);

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Successfully leaved project');
      router.refresh();
    },
    onError(e) {
      toast.error('Failed to leave project', { description: e.message });
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!isPending) {
      setOpen(open);
    }
  };

  return (
    <DropdownMenuItem variant="destructive" asChild>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 rounded-sm dark:hover:bg-destructive/20 hover:text-destructive w-full px-2! py-1.5! justify-start h-auto"
          >
            <LogOutIcon />
            Leave project
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will leave this project, but you can re-join later if someone
              invite you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={() => mutate()}>
              {isPending ? (
                <>
                  <Spinner />
                  Loading...
                </>
              ) : (
                <>Confirm</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  );
};

export default LeaveProjectDropdownItem;
