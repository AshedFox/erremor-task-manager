'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Input } from '@workspace/ui/components/input';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useRef } from 'react';
import { toast } from 'sonner';

import { useUpdateAvatar } from '@/hooks/use-update-avatar';

type Props = {
  url?: string;
  username: string;
  userId: string;
};

const AvatarInput = ({ username, url }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useUpdateAvatar({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current-user'],
      });
      router.refresh();
      toast.success('Successfully updated avatar');
    },
    onError: (e) => {
      toast.error('Failed to update avatar', {
        description: e.message,
      });
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    mutate(e.target.files.item(0)!);
  };

  return (
    <div className="flex flex-col">
      <Avatar
        className="size-24 cursor-pointer hover:opacity-70"
        onClick={() => fileInputRef.current?.click()}
      >
        <AvatarImage className="object-cover" src={url} />
        <AvatarFallback className="bg-secondary">
          {username
            .split('-')
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase())
            .join('')}
        </AvatarFallback>
      </Avatar>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarInput;
