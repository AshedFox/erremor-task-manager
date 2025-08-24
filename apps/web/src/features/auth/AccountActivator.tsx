'use client';

import { useMutation } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { ArrowLeft, FrownIcon, LogInIcon, SmileIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';

import Spinner from '@/components/Spinner';
import { activate } from '@/lib/actions/activate';

type Props = {
  token?: string;
};

const AccountActivator = ({ token }: Props) => {
  const { error, mutate, isPending, isIdle } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('Activation token is missing.');
      }
      const result = await activate({ token });

      if (result?.errors) {
        throw new Error(result.errors.join(', '));
      }
    },
    onSuccess: () => {
      toast.success('Successfully activated account!', {
        description: 'Welcome to Erremor! Now login to use our service!',
        action: (
          <Button variant="link" asChild>
            <Link href="/login">Login</Link>
          </Button>
        ),
      });
    },
    onError: (error: Error) => {
      toast.error('Activation failed!', { description: error.message });
    },
  });

  if (isIdle) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center max-w-md">
        <p className="text-center text-3xl font-mono font-extrabold">
          If you want to activate your account, click the button below!
        </p>
        <Button variant="secondary" size="lg" onClick={() => mutate()}>
          Activate account
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        <Spinner className="size-32" />
        <p className="text-center text-3xl font-mono font-extrabold">
          Activating
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8 items-center justify-center max-w-lg">
        <div className="flex flex-col gap-2 items-center justify-center">
          <FrownIcon className="size-48" />
          <div className="text-5xl font-bold text-center font-mono">
            {error.message}
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/">
              <ArrowLeft />
              Go to homepage
            </Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/register">
              Try to register
              <LogInIcon />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center max-w-lg">
      <div className="flex flex-col gap-2 items-center justify-center">
        <SmileIcon className="size-48" />
        <div className="text-5xl font-bold text-center font-mono">
          Successfully activated account
        </div>
      </div>
      <Button size="lg" asChild>
        <Link href="/login">
          Login into your account
          <LogInIcon />
        </Link>
      </Button>
    </div>
  );
};

export default AccountActivator;
