'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { useRouter } from 'next/navigation';
import React from 'react';

import { User } from '@/types/user';

import EditProfileForm from './EditProfileForm';

type Props = {
  user: User;
};

const EditProfileDialog = ({ user }: Props) => {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        router.back();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <EditProfileForm
          user={user}
          onSuccess={() => {
            router.back();
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
