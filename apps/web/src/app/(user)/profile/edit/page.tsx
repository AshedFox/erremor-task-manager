import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import EditProfileForm from '@/features/user/EditProfileForm';
import { apiFetch } from '@/lib/api-fetch.server';
import { User } from '@/types/user';

export const metadata: Metadata = {
  title: 'Edit profile',
};

const Page = async () => {
  const user = await apiFetch<User>('/users/me');

  return (
    <div className="p-6 flex flex-col md:flex-row items-start gap-4 flex-1">
      <Button variant="ghost" asChild>
        <Link href="/profile" replace>
          <ArrowLeft /> Back
        </Link>
      </Button>
      <div className="space-y-6 max-w-3xl mx-auto w-full h-full">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">
            Change your account information
          </p>
        </div>

        <Card>
          <CardContent>
            <EditProfileForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
