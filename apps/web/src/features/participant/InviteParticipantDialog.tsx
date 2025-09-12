import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import React from 'react';

import { Participant } from '@/types/participant';

import InviteParticipantForm from './InviteParticipantForm';

type Props = {
  projectId: string;
  currentParticipant: Participant;
};

const InviteParticipantDialog = ({ projectId, currentParticipant }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>
            Create invitation to invite user to this project
          </DialogDescription>
        </DialogHeader>
        <InviteParticipantForm
          projectId={projectId}
          currentParticipant={currentParticipant}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InviteParticipantDialog;
