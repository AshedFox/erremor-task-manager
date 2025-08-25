'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

type Props = {
  className?: string;
};

const LogoutButton = ({ className }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error();
      }
    },
    onError: () => {
      toast.error('Logout failed');
    },
    onSuccess: () => {
      toast.success('Logout successfully');
      queryClient.invalidateQueries({
        queryKey: ['current-user'],
      });
      router.push('/login');
    },
  });
  return (
    <Button
      className={className}
      variant="destructive"
      disabled={isPending}
      onClick={() => mutate()}
    >
      <LogOutIcon /> Logout
    </Button>
  );
};

export default LogoutButton;
