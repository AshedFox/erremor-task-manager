import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { format } from 'date-fns';
import { CakeIcon, CalendarIcon, HistoryIcon, MailIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { User } from '@/types/user';

import LogoutButton from '../auth/LogoutButton';

type Props = {
  user: User;
};

const ProfileCard = ({ user }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardAction>
          <Button variant="outline" asChild>
            <Link href="/profile/edit">Edit profile</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <Avatar className="size-24">
            <AvatarImage />
            <AvatarFallback className="bg-secondary">
              {user?.username
                .split('-')
                .slice(0, 2)
                .map((word) => word[0]?.toUpperCase())
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {user.displayName ??
                user.username.split('-').slice(0, 2).join(' ')}
            </h2>
            <p className="text-muted-foreground">{user.username}</p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-center gap-2">
            <MailIcon className="text-muted-foreground size-5" />
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-muted-foreground size-5" />
            <div>
              <p className="text-muted-foreground text-sm">Joined</p>
              <p className="font-medium">{format(user.createdAt, 'PPP')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="text-muted-foreground size-5" />
            <div>
              <p className="text-muted-foreground text-sm">Last Modified</p>
              <p className="font-medium">{format(user.updatedAt, 'PPP')}</p>
            </div>
          </div>
          {user.birthDate && (
            <div className="flex items-center gap-2">
              <CakeIcon className="text-muted-foreground size-5" />
              <div>
                <p className="text-muted-foreground text-sm">Birth Date</p>
                <p className="font-medium">{format(user.birthDate, 'PPP')}</p>
              </div>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>
      <CardFooter className="justify-end">
        <LogoutButton />
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
