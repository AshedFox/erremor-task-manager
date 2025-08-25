'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

type Props = {
  className?: string;
};

const LogoutDropdownItem = ({ className }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success('Logout successful');
      queryClient.invalidateQueries({
        queryKey: ['current-user'],
      });
      router.push('/login');
    },
  });
  return (
    <DropdownMenuItem
      className={className}
      variant="destructive"
      disabled={isPending}
      onClick={() => mutate()}
    >
      <LogOutIcon /> Logout
    </DropdownMenuItem>
  );
};

export default LogoutDropdownItem;
