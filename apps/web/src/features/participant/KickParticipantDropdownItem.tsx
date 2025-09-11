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
import { cn } from '@workspace/ui/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import Spinner from '@/components/Spinner';
import { kickParticipant } from '@/lib/actions/kick-participant';

type Props = {
  className?: string;
  projectId: string;
  userId: string;
};

const KickParticipantDropdownItem = ({
  className,
  projectId,
  userId,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => kickParticipant(projectId, userId),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'participants'],
      });
      toast.success('Successfully kicked user from project');
      router.refresh();
    },
    onError(e) {
      toast.error('Failed to kick participant', { description: e.message });
    },
  });

  return (
    <DropdownMenuItem variant="destructive" asChild>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'text-destructive hover:bg-destructive/10 rounded-sm dark:hover:bg-destructive/20 hover:text-destructive w-full px-2! py-1.5! justify-start h-auto font-normal',
              className
            )}
            size="sm"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                Loading...
              </>
            ) : (
              'Kick'
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are going to kick someone from project
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={() => mutate()}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  );
};

export default KickParticipantDropdownItem;
