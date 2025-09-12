'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import Spinner from '@/components/Spinner';
import { acceptInvitation } from '@/lib/actions/accept-invitation';

type Props = {
  className?: string;
  projectId: string;
};

const AcceptInvitationDropdownItem = ({ className, projectId }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => acceptInvitation(projectId),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'invitations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'participants'],
      });
      queryClient.invalidateQueries({ queryKey: ['user', 'invitations'] });
      toast.success('Successfully accepted invitation');
      router.refresh();
    },
    onError(e) {
      toast.error('Failed to accept invitation', { description: e.message });
    },
  });

  return (
    <DropdownMenuItem className={className} onClick={() => mutate()}>
      {isPending ? (
        <>
          <Spinner />
          Loading...
        </>
      ) : (
        'Accept'
      )}
    </DropdownMenuItem>
  );
};

export default AcceptInvitationDropdownItem;
