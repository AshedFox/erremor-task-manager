'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import Spinner from '@/components/Spinner';
import { rejectInvitation } from '@/lib/actions/reject-invitation';

type Props = {
  className?: string;
  projectId: string;
};

const RejectInvitationDropdownItem = ({ className, projectId }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => rejectInvitation(projectId),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'invitations'],
      });
      queryClient.invalidateQueries({ queryKey: ['user', 'invitations'] });
      toast.success('Successfully rejected invitation');
      router.refresh();
    },
    onError(e) {
      toast.error('Failed to reject invitation', { description: e.message });
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
        'Reject'
      )}
    </DropdownMenuItem>
  );
};

export default RejectInvitationDropdownItem;
