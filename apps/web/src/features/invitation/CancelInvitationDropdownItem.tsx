'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { toast } from 'sonner';

import Spinner from '@/components/Spinner';
import { cancelInvitation } from '@/lib/actions/cancel-invitation';

type Props = {
  className?: string;
  projectId: string;
  userId: string;
};

const CancelInvitationDropdownItem = ({
  className,
  projectId,
  userId,
}: Props) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => cancelInvitation(projectId, userId),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'invitations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'participants'],
      });
      toast.success('Successfully canceled invitation');
    },
    onError(e) {
      toast.error('Failed to cancel invitation', { description: e.message });
    },
  });

  return (
    <DropdownMenuItem
      variant="destructive"
      className={className}
      onClick={() => mutate()}
    >
      {isPending ? (
        <>
          <Spinner />
          Loading...
        </>
      ) : (
        'Cancel'
      )}
    </DropdownMenuItem>
  );
};

export default CancelInvitationDropdownItem;
